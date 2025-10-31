import {type Request,type Response } from "express";
import { Follow } from "./follow.model";
import { User } from "../users/user.model"; // assuming you already have a User model
import mongoose from "mongoose";
import type { AuthRequest } from "../../middleware/authMiddleware";

export const followUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; 
    const followerId = req.body.followerId;

    if (!mongoose.Types.ObjectId.isValid(userId!) || !mongoose.Types.ObjectId.isValid(followerId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (userId === followerId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const alreadyFollowing = await Follow.findOne({
      follower: followerId,
      following: userId,
    });

    if (alreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    const follow = await Follow.create({
      follower: followerId,
      following: userId,
    });

    return res.status(201).json({
      message: "Followed successfully",
      data: follow,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const followerId = req.body.followerId;

    const follow = await Follow.findOneAndDelete({
      follower: followerId,
      following: userId,
    });

    if (!follow) {
      return res.status(404).json({ message: "Not following this user" });
    }

    return res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get followers of a user
 */
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const followers = await Follow.find({ following: userId })
      .populate("follower", "username profilePic");

    res.status(200).json({
      count: followers.length,
      followers,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get following list of a user
 */
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const following = await Follow.find({ follower: userId })
      .populate("following", "username profilePic");

    res.status(200).json({
      count: following.length,
      following,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Check if logged-in user and another user are mutual followers
 */
export const checkMutualFollow = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot check mutual follow with yourself" });
    }

    // Check if current user follows the other
    const currentFollowsOther = await Follow.findOne({
      follower: currentUserId,
      following: userId,
    });

    // Check if other user follows the current
    const otherFollowsCurrent = await Follow.findOne({
      follower: userId,
      following: currentUserId,
    });

    const isMutual = !!(currentFollowsOther && otherFollowsCurrent);

    return res.status(200).json({
      mutual: isMutual,
      youFollow: !!currentFollowsOther,
      theyFollow: !!otherFollowsCurrent,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Suggest users that the current user doesn't follow yet
 */
export const getSuggestedUsers = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user._id;

    // Get IDs of users the current user already follows
    const following = await Follow.find({ follower: currentUserId }).select("following");
    const followingIds = following.map((f) => f.following.toString());

    // Exclude: current user + already-following users
    const excludeIds = [...followingIds, currentUserId.toString()];

    // Find random users not in that list
    const suggestions = await User.aggregate([
      { $match: { _id: { $nin: excludeIds.map((id) => new mongoose.Types.ObjectId(id)) } } },
      { $sample: { size: 10 } }, // get 10 random users
      { $project: { username: 1, profilePic: 1, bio: 1 } },
    ]);

    res.status(200).json({
      count: suggestions.length,
      suggestions,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

