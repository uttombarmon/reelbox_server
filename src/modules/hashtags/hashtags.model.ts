import mongoose, { Schema, Document } from "mongoose";

export interface IHashtag extends Document {
  tag: string;
  videos: mongoose.Types.ObjectId[];
  usageCount: number;
  createdAt: Date;
}

const hashtagSchema = new Schema<IHashtag>(
  {
    tag: { type: String, unique: true, required: true },
    videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Hashtag = mongoose.model<IHashtag>("Hashtag", hashtagSchema);
