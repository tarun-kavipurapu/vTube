import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Playlist } from "../models/playlists.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Video } from "../models/videos.models.js";
import { Mongoose } from "mongoose";
import { User } from "../models/users.models.js";
export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

const getPlayListById = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { playlistId } = req.params;
    if (!playlistId) {
      throw new ApiError(400, "playlist Id not given");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(500, "Playlsit not found in DB");
    }
    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist sucessfully retreived"));
  }
);
const deletePlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { playlistId } = req.params;
    if (!playlistId) {
      throw new ApiError(400, "playlist Id not given");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(500, "Playlsit not found in DB");
    }
    if (playlist?.owner.toString() != req.user._id.toString()) {
      throw new ApiError(
        501,
        "You dont have authorization to delete the playlist"
      );
    }
    const deletePlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletePlaylist) {
      throw new ApiError(500, "Unable to delte Playllist");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, deletePlaylist, "Playlist sucessfully Deleted")
      );
  }
);
const updatePlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    if (!name && !description) {
      throw new ApiError(400, "Enter the name and description");
    }
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(400, "Playlist not found");
    }
    if (playlist?.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to add video in this playlist!"
      );
    }
    playlist.name = name;
    playlist.description = description;
    const updatePlaylist = await playlist.save();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatePlaylist,
          "Playlist name and description updated"
        )
      );
  }
);
const createPlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user._id;
    const { name, description } = req.body;
    if (!name || !description) {
      throw new ApiError(400, "Enter the name and description");
    }
    const playlist = await Playlist.create({
      name,
      description,
      owner: user,
    });
    if (!playlist) {
      throw new ApiError(500, "Playlist not created");
    }

    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Sucessfully created the playlist"));
  }
);

const getUserPlaylists = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      throw new ApiError(401, "Enter the userID");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const playlist = await Playlist.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
    ]);
    if (!playlist) {
      throw new ApiError(500, "Could not find Playlist");
    }

    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist sucessfully retreived"));
    //TODO:may need to change return Playlist object
  }
);

const addVideoToPlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { playlistId } = req.params;
    const { videoId } = req.params;
    if (!playlistId || !videoId) {
      throw new ApiError(401, "You have not entered pplaylistId  or VideoId");
    }

    // Check if the user owns the playlist
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "no playlist found!");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to add video in this playlist!"
      );
    }

    // find video in db
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "no video found!");
    }
    const videoObject = new mongoose.Types.ObjectId(videoId);
    //@ts-ignore
    if (playlist.videos.includes(videoObject)) {
      throw new ApiError(400, "video already exists in this playlist!!");
    }
    //@ts-ignore
    const addVideo = playlist.videos.push(videoObject);
    await playlist.save();
    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video added to the playlist"));
  }
);

const removeVideFromPlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { playlistId } = req.params;
    const { videoId } = req.params;
    if (!playlistId || !videoId) {
      throw new ApiError(401, "You have not entered pplaylistId  or VideoId");
    }

    // Check if the user owns the playlist
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new ApiError(404, "no playlist found!");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to remove video from this playlist!"
      );
    }

    // find video in db
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "no video found!");
    }
    const videoObject = new mongoose.Types.ObjectId(videoId);
    //@ts-ignore
    if (!playlist.videos.includes(videoObject)) {
      throw new ApiError(400, "video does not  exists in this playlist!!");
    }
    //@ts-ignore
    const index = playlist.videos.indexOf(videoObject);

    if (index > -1) {
      playlist.videos.splice(index, 1);
    }

    await playlist.save();

    res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video removed from the playlist"));
  }
);

export {
  getPlayListById,
  deletePlaylist,
  updatePlaylist,
  getUserPlaylists,
  addVideoToPlaylist,
  createPlaylist,
  removeVideFromPlaylist,
};
