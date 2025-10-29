import express, { Router } from "express";
import {
  getFeed,
  getVideo,
  uploadVideo,
  incrementView,
  deleteVideo,
  upload,
} from "./video.controller.ts";
import { authMiddleware } from "../../middleware/authMiddleware.ts";

const videoRouter: Router = express.Router();

videoRouter.get("/", getFeed);
videoRouter.get("/:id", getVideo);
videoRouter.post("/:id/view", incrementView);
videoRouter.delete("/:id", authMiddleware, deleteVideo);
videoRouter.post("/", authMiddleware, upload.single("video"), uploadVideo);

export default videoRouter;
