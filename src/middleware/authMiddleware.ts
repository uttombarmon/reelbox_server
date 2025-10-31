import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../modules/users/user.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  try {
    const token2 = req.cookies.auth_token;
    // console.log("token2: ", token2);
    if (!token2) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // const header = req.headers.authorization;
    // if (!header || !header.startsWith("Bearer ")) {
    //   console.log("!token: ", header);
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    // console.log("token: ", header);
    // const token = header.split(" ")[1];
    // console.log(token);
    // if (!token2) return res.status(401).json({ message: "Unauthorized" });
    const payload: any = jwt.verify(token2, JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (err: any) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
};
