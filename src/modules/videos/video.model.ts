import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  user: mongoose.Types.ObjectId;
  videoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  hashtags?: string[];
  duration?: number;
  views: number;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: String,
    caption: String,
    hashtags: [String],
    duration: Number,
    views: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Video = mongoose.model<IVideo>("Video", videoSchema);
