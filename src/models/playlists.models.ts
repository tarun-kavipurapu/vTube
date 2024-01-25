import mongoose, { Schema } from "mongoose";
import { IPlaylists } from "./modelTypes.js";
const playlistSchema: Schema<IPlaylists> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Playlist = mongoose.model<IPlaylists>("Playlist", playlistSchema);
