import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  targetUser?: mongoose.Types.ObjectId;
  video?: mongoose.Types.ObjectId;
  reason: string;
  status: "pending" | "resolved";
  createdAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetUser: { type: Schema.Types.ObjectId, ref: "User" },
    video: { type: Schema.Types.ObjectId, ref: "Video" },
    reason: String,
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Report = mongoose.model<IReport>("Report", reportSchema);
