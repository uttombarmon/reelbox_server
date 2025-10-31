import express, { Router } from "express";
import { register, login, authme, logout } from "./auth.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const authRouter: Router = express.Router();

authRouter.get("/me", authMiddleware, authme);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
