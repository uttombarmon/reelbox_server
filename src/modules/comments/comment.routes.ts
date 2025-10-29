import express, { Router } from "express";
import { addComment, getComments } from "./comment.controller.ts";
import { authMiddleware } from "../../middleware/authMiddleware.ts";

const commentRouter: Router = express.Router({ mergeParams: true });

commentRouter.get("/:id/comments", getComments);
commentRouter.post("/:id/comments", authMiddleware, addComment);

export default commentRouter;
