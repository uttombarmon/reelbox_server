import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model.ts";
import { logger } from "../../utils/logger.ts";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, fullName });
    await user.save();
    if (!user || !user._id) {
      res.status(500).json({ message: "Error registering user" });
      return;
    }
    if (!JWT_SECRET) {
      logger.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Internal server error" });
    }
    const userId: string = user._id.toString();
    const token = jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    logger.info(`User registered: ${username}`);
    res.status(201).json({ user: { id: user._id, username, email }, token });
  } catch (err: any) {
    logger.error(`Register error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (!JWT_SECRET) {
      logger.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Internal server error" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    logger.info(`User login: ${user.username}`);
    res.json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err: any) {
    logger.error(`Login error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};
