import mongoose, { Schema } from "mongoose";
import { ILike } from "./modelTypes.js";
const likeSchema: Schema<ILike> = new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  {
    timestamps: true,
  }
);

export const Like = mongoose.model<ILike>("Like", likeSchema);
