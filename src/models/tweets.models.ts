import mongoose, { Schema } from "mongoose";
import { Itweet } from "./modelTypes.js";
const tweetSchema: Schema<Itweet> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Tweet = mongoose.model<Itweet>("Tweet", tweetSchema);
