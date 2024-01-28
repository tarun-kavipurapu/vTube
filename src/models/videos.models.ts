import mongoose, { Schema, mongo } from "mongoose";
import { Ivideo } from "./modelTypes.js";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema: Schema<Ivideo> = new Schema(
  {
    videoFile: {
      type: String, //cloudinary url
      required: [true, "Video file is required"],
    },
    thumbnail: {
      type: String, //cloudinary url
      required: [true, "Thumbnail is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    duration: {
      type: Number, //comes from cloudinary
      required: [true, "Duration is required"],
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model<Ivideo>("Video", videoSchema);
