import express, { type Router } from "express";
import { getProfile, updateProfile, followToggle } from "./user.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const userRouter: Router = express.Router();

userRouter.get("/:id", getProfile);
userRouter.put("/me", authMiddleware, updateProfile);
userRouter.post("/:id/follow", authMiddleware, followToggle);

export default userRouter;
