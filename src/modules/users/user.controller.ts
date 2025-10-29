import { type Request, type Response } from "express";
import { User } from "./user.model.ts";
import { Follow } from "../follows/follow.model.ts";
import type { AuthRequest } from "../../middleware/authMiddleware.ts";
import { logger } from "../../utils/logger.ts";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err: any) {
    logger.error(`GetProfile error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const updates = req.body;
    Object.assign(user, updates);
    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const followToggle = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { id: targetId } = req.params;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user._id.toString() === targetId)
      return res.status(400).json({ message: "Cannot follow yourself" });

    const existing = await Follow.findOne({
      follower: user._id,
      following: targetId,
    });
    if (existing) {
      // unfollow
      await existing.deleteOne();
      await User.findByIdAndUpdate(user._id, { $inc: { followingCount: -1 } });
      await User.findByIdAndUpdate(targetId, { $inc: { followersCount: -1 } });
      return res.json({ message: "Unfollowed" });
    } else {
      // follow
      await Follow.create({ follower: user._id, following: targetId });
      await User.findByIdAndUpdate(user._id, { $inc: { followingCount: 1 } });
      await User.findByIdAndUpdate(targetId, { $inc: { followersCount: 1 } });
      return res.json({ message: "Followed" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
