import mongoose, { Mongoose, Query } from "mongoose";
import { Video } from "../models/videos.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response } from "express";
import { cloudinaryFileUpload } from "../utils/cloudinary.js";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}
interface VideoQuery {
  page?: number;
  limit?: string;
  query?: any;
  sortBy?: string;
  sortType?: any;
  userId?: string;
}
//TODO:Each time a video is fetched increase the views?
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
//TODO: create a cloudinary function which deletes the videos and thumnail in cloudinary
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
//TODO: create a cloudinary function which deletes the videos and thumnail in cloudinary
const updateThumbnail = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {}
);
const uploadVideo = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    //takke video and thumbnail by muter
    //and then upload the video to cloudinary then
    //take that url of the cloudinary upload to video Db
    const { title, description } = req.body;

    if ([title, description].some((field) => field.trim() === "")) {
      res.status(400);
      throw new ApiError(400, "All fields are required");
    }
    const thumbnailLocalPath = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.thumbnail[0]?.path;
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "thumnail File not available on multer");
    }
    const videoLocalPath = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.videoFile[0]?.path;
    if (!videoLocalPath) {
      throw new ApiError(400, "Video File not available on multer");
    }
    const thumbnail = await cloudinaryFileUpload(thumbnailLocalPath);
    const videoFile = await cloudinaryFileUpload(videoLocalPath);

    if (!thumbnail?.url) {
      throw new ApiError(400, "thumbnail not uploaded on cloudinary");
    }
    if (!videoFile?.url) {
      throw new ApiError(400, "Video not uploaded on cloudinary");
    }
    const newVideo = await Video.create({
      videoFile: videoFile?.url,
      thumbnail: thumbnail?.url,
      owner: req.user._id,
      title,
      description,
      duration: videoFile?.duration,
    });
    if (!newVideo) {
      throw new ApiError(500, "Video not uploaded on Database");
    }
    res
      .status(200)
      .json(new ApiResponse(200, newVideo, "Sucessfully video Uploaded"));
  }
);
const getAllVideos = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const {
      page = 1,
      limit = "10",
      query,
      sortBy,
      sortType = 1,
      userId = req.user._id,
    }: VideoQuery = req.query as VideoQuery;

    const video = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $sort: {
          [sortBy || "createdAt"]: sortType === "desc" ? -1 : 1,
        },
      },
      {
        $skip: (page - 1) * parseInt(limit),
      },
      {
        $limit: parseInt(limit),
      },
    ]);
    Video.aggregatePaginate(video, { page, limit })
      .then((result: any) => {
        return res
          .status(200)
          .json(
            new ApiResponse(200, result, "fetched all videos successfully !!")
          );
      })
      .catch((error: any) => {
        console.log("getting error while fetching all videos:", error);
        throw error;
      });
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
