import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import methodOverride from "method-override";
import { errorHandler } from "./middleware/errorHandler";
import dotenv from "dotenv";
import { clientErrorHandler } from "./middleware/clientErrorHandle";
import userRouter from "./modules/users/user.routes";
import authRouter from "./modules/auth/auth.routes";
import connectDB from "./config/ConnectDB";
import videoRouter from "./modules/videos/video.routes";
import commentRouter from "./modules/comments/comment.routes";
import likeRouter from "./modules/likes/like.routes";
import followRouter from "./modules/follows/follow.routes";
import cookieParser from "cookie-parser";

const app = express();
const PORT: number = 5000;
dotenv.config();

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());

app.get("/", (req: any, res: any) => {
  res.send("Hello from ReelBox Server!");
});

connectDB();
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/follow", followRouter);
app.use(clientErrorHandler);
if (!process.env.NODE_ENV) {
  app.use(errorHandler);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
