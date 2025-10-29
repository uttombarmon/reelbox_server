import express, { Router } from "express";
import { toggleLike } from "./like.controller.ts";
import { authMiddleware } from "../../middleware/authMiddleware.ts";

const likeRouter: Router = express.Router();

likeRouter.post("/:id/like", authMiddleware, toggleLike);

export default likeRouter;
