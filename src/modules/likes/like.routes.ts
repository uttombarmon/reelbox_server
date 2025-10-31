import express, { Router } from "express";
import { toggleLike } from "./like.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const likeRouter: Router = express.Router();

likeRouter.post("/:id/like", authMiddleware, toggleLike);

export default likeRouter;
