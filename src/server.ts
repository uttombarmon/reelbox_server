import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import { errorHandler } from "./middleware/errorHandler.ts";
import dotenv from "dotenv";
import { clientErrorHandler } from "./middleware/clientErrorHandle.ts";
import { logErrors } from "./middleware/logErrors.ts";
import userRouter from "./modules/users/user.routes.ts";
import authRouter from "./modules/auth/auth.routes.ts";
import connectDB from "./config/ConnectDB.ts";
import videoRouter from "./modules/videos/video.routes.ts";
import commentRouter from "./modules/comments/comment.routes.ts";
import likeRouter from "./modules/likes/like.routes.ts";

const app = express();
const PORT: number = 3000;
dotenv.config();

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(methodOverride());

app.get("/", (req: any, res: any) => {
  res.send("Hello from ReelBox Server!");
});

connectDB();
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/like", likeRouter);
app.use(logErrors);
app.use(clientErrorHandler);
if (!process.env.NODE_ENV) {
  app.use(errorHandler);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
