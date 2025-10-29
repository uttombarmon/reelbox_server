import { type Request, type Response } from "express";
import type { AuthRequest } from "../../middleware/authMiddleware";
import { uploadToImageKit, buildThumbnailUrl } from "../../utils/media.ts";
import { Video } from "./video.model.ts";
import { logger } from "../../utils/logger.ts";

import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // e.g., 200MB max
});

//upload video
export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const file = (req as any).file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to ImageKit
    const result = await uploadToImageKit(
      file.buffer,
      file.originalname,
      "videos"
    );

    const videoUrl = result.url;
    const thumbnailUrl = buildThumbnailUrl(videoUrl!);

    const videoDoc = await Video.create({
      user: req.user._id,
      videoUrl,
      thumbnailUrl,
      caption: req.body.caption,
      privacy: req.body.privacy || "public",
      duration: result.metadata?.duration, // if returned from ImageKit
    });

    logger.info(`Video uploaded: ${videoDoc._id} by user ${req.user.username}`);
    return res.status(201).json(videoDoc);
  } catch (error: any) {
    logger.error(`error uploading video: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
//get feed
export const getFeed = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 0;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const videos = await Video.find({ privacy: "public" })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("user", "username avatar");

    res.json(videos);
  } catch (err: any) {
    logger.error(`GetFeed error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};
//Get Single Video
export const getVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate("user", "username avatar");
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
//Increment Views
export const incrementView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });
    res.json({ message: "View incremented" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
//Delete Video
export const deleteVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Not found" });
    if (!req.user || video.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await video.deleteOne();
    res.json({ message: "Video deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export { upload };
