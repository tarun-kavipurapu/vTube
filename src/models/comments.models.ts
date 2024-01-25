import mongoose, { Schema } from "mongoose";
import { IComment } from "./modelTypes.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema: Schema<IComment> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
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
commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
