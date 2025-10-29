import { type Request, type Response } from "express";
import { Video } from "./video.model.ts";
import { uploadToImageKit } from "../../utils/media.upload.ts";
import multer from "multer";
import type { AuthRequest } from "../../middleware/authMiddleware.ts";
import { logger } from "../../utils/logger.ts";

// configure multer (memory storage for buffer upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

// Upload Video
export const uploadVideo = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const file = (req as any).file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to ImageKit
    const uploaded = await uploadToImageKit(file.buffer, file.originalname);
    const video = await Video.create({
      user: req.user._id,
      videoUrl: uploaded.url,
      thumbnailUrl: uploaded.thumbnailUrl ?? uploaded.url,
      caption: req.body.caption,
      privacy: req.body.privacy || "public",
    });

    logger.info(`Video uploaded by ${req.user.username}`);
    res.status(201).json(video);
  } catch (err: any) {
    logger.error(`UploadVideo error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// Get Feed
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

//  Get Single Video
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

// Increment Views
export const incrementView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });
    res.json({ message: "View incremented" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//  Delete Video
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
