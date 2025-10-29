import { type Request, type Response } from "express";
import { Like } from "./like.model.ts";
import { Video } from "../videos/video.model.ts";
import type { AuthRequest } from "../../middleware/authMiddleware.ts";

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { id: videoId } = req.params;
    const existing = await Like.findOne({ user: req.user._id, video: videoId });
    if (existing) {
      await existing.deleteOne();
      await Video.findByIdAndUpdate(videoId, { $inc: { likesCount: -1 } });
      return res.json({ message: "Unliked" });
    } else {
      await Like.create({ user: req.user._id, video: videoId });
      await Video.findByIdAndUpdate(videoId, { $inc: { likesCount: 1 } });
      return res.json({ message: "Liked" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
