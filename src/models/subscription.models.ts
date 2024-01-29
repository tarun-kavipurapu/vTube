import mongoose, { Schema, Document, Query, HydratedDocument } from "mongoose";
import { Isubsctibe } from "./modelTypes.js";
const subscriptionScheme: Schema<Isubsctibe> = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //subscribedTo
      ref: "User",
    },

    channel: {
      type: Schema.Types.ObjectId, //subscribers
      ref: "User",
    },
  },
  //subscriber subscribed too channel
  {
    timestamps: true,
  }
);

export const Subscribe = mongoose.model<Isubsctibe>(
  "Subscription",
  subscriptionScheme
);
