import { type Request, type Response } from "express";
import { Comment } from "./comment.model.ts";
import { Video } from "../videos/video.model.ts";
import type { AuthRequest } from "../../middleware/authMiddleware.ts";
import { logger } from "../../utils/logger.ts";

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { id: videoId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text required" });

    const comment = await Comment.create({
      video: videoId,
      user: req.user._id,
      text,
    });
    await Video.findByIdAndUpdate(videoId, { $inc: { commentsCount: 1 } });

    logger.info(`Comment added by ${req.user.username} on video ${videoId}`);
    res.status(201).json(comment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ video: id })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar");
    res.json(comments);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
