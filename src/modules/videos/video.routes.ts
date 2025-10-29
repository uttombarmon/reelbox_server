import express, { Router } from "express";
import { getFeed, getVideo, incrementView, upload, uploadVideo } from "./video.controller.ts";
import { authMiddleware } from "../../middleware/authMiddleware.ts";

const videoRouter: Router = express.Router();

// Public feed
videoRouter.get("/", getFeed);
videoRouter.get("/:id", getVideo);
videoRouter.post("/:id/view", incrementView);

// Protected upload route
videoRouter.post("/", authMiddleware, upload.single("video"), uploadVideo);

export default videoRouter;
