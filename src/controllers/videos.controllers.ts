import { Video } from "../models/videos.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response } from "express";
export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

const getVideoById = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { videoId } = req.params;
    if (!videoId) {
      throw new ApiError(400, "Video Id is not given");
    }
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Error while fetching video");
    }
    if (video.isPublished === false) {
      throw new ApiError(403, "Make the Video Published to view the video");
    }
    res
      .status(200)
      .json(new ApiResponse(200, video, "Fetched  Video Sucessfullly"));
  }
);
const deleteById = asyncHandler(
  //check ownership
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { videoId } = req.params;
    if (!videoId) {
      throw new ApiError(400, "Video Id is not given");
    }
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Error while fetching video");
    }
    if (video?.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to delete this video!"
      );
    }
    const videoDelete = await Video.findByIdAndDelete(videoId);

    if (!videoDelete) {
      throw new ApiError(500, "Video not deleted");
    }
    res
      .status(200)
      .json(new ApiResponse(200, videoDelete, "Fetched  Video Sucessfullly"));
  }
);

const updateThumbnail = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {}
);
const uploadVideo = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {}
);
const getAllVideos = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const {};
  }
);
const togglePublishStatus = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { videoId } = req.params;
    if (!videoId) {
      throw new ApiError(400, "Video Id is not given");
    }
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(500, "Error while fetching video");
    }

    video.isPublished = !video.isPublished;

    await video.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, video.isPublished, "Status of Video is changed")
      );
  }
);
export {
  deleteById,
  updateThumbnail,
  getVideoById,
  uploadVideo,
  getAllVideos,
  togglePublishStatus,
};
