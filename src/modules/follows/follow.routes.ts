import { Router } from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkMutualFollow,
  getSuggestedUsers,
} from "./follow.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const followRouter: Router = Router();

// POST /api/follow/:userId — follow someone
followRouter.post("/:userId",authMiddleware, followUser);

// DELETE /api/follow/:userId — unfollow someone
followRouter.delete("/:userId",authMiddleware, unfollowUser);

// GET /api/follow/:userId/followers — list of followers
followRouter.get("/:userId/followers", getFollowers);

// GET /api/follow/:userId/following — list of following
followRouter.get("/:userId/following", getFollowing);
//get mutual following
followRouter.get("/:userId/mutual", authMiddleware, checkMutualFollow);
followRouter.get("/suggestions", authMiddleware, getSuggestedUsers);

export default followRouter;
