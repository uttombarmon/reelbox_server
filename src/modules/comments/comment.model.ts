import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  video: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  likesCount: number;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
