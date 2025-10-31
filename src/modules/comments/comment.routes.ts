import express, { Router } from "express";
import { addComment, getComments } from "./comment.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const commentRouter: Router = express.Router({ mergeParams: true });

commentRouter.get("/:id/comments", getComments);
commentRouter.post("/:id/comments", authMiddleware, addComment);

export default commentRouter;
