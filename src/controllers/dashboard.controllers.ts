import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/videos.models.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

const getChannelStats = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user._id;
  }

  //channel stats what are involved are
  //subscribes
  //average likes in views
  //subscribed percentage
  //
);
const getChannelVideos = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user._id;

    const videos = Video.findOne({ owner: user });

    res.status(200).json(new ApiResponse(200, videos, "User Videos Obtained"));
  }
);

export { getChannelStats, getChannelVideos };
