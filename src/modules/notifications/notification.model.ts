import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  fromUser?: mongoose.Types.ObjectId;
  type: "like" | "comment" | "follow";
  video?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["like", "comment", "follow"], required: true },
    video: { type: Schema.Types.ObjectId, ref: "Video" },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);
