import express, { Router } from "express";
import { register, login } from "./auth.controller.ts";

const authRouter: Router = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
