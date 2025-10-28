import express, { Router } from "express";
import { getUsers, addUser } from "./user.controller.ts";

const userRouter: Router = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/", addUser);

export default userRouter;
