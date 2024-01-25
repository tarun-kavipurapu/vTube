import mongoose, { Schema, Document, Query, HydratedDocument } from "mongoose";
import { Isubsctibe } from "./modelTypes.js";
const subscriptionScheme: Schema<Isubsctibe> = new Schema(
  {
    subscriber: 
      {
        type: Schema.Types.ObjectId,//one who is subscribing
        ref: "User",
      },
    
    channel: {
      type: Schema.Types.ObjectId,//one whome to subscriber is subscribing
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscribe = mongoose.model<Isubsctibe>("Subscription",subscriptionScheme);