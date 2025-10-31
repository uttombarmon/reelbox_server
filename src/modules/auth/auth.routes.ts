import express, { Router } from "express";
import { register, login, authme } from "./auth.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const authRouter: Router = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authMiddleware, authme);

export default authRouter;
