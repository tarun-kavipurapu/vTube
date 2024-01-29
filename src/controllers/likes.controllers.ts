import mongoose from "mongoose";
import { Comment } from "../models/comments.models.js";
import { Like } from "../models/likes.models.js";
import { Tweet } from "../models/tweets.models.js";
import { Video } from "../models/videos.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError.js";
export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

const toggleVideoLike = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { videoId } = req.params;
    if (!videoId) {
    }
    const video = await Video.findById(videoId);
    if (!video) {
    }
    const toggleLike = await Like.findOne({
      video: videoId,
    });
    let deleteLike;
    let createLike;
    if (toggleLike) {
      //delete Like
      deleteLike = await Like.deleteOne({
        video: videoId,
      });
    } else {
      const createLike = await Like.create({
        video: videoId,
        likedBy: req.user._id,
      });
    }
    res
      .status(200)
      .json(new ApiResponse(200, `${createLike ? "Liked" : "Unlike"}`));
  }
);
const toggleCommentLike = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { commentId } = req.params;
    if (!commentId) {
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
    }
    const toggleLike = await Like.findOne({
      comment: commentId,
    });
    let deleteLike;
    let createLike;
    if (toggleLike) {
      //delete Like
      deleteLike = await Like.deleteOne({
        comment: commentId,
      });
    } else {
      const createLike = await Like.create({
        comment: commentId,
        likedBy: req.user._id,
      });
    }
    res
      .status(200)
      .json(new ApiResponse(200, `${createLike ? "Liked" : "Unlike"}`));
  }
);

const toggleTweetLike = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { tweetId } = req.params;
    if (!tweetId) {
    }
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
    }
    const toggleLike = await Like.findOne({
      tweet: tweetId,
    });
    let deleteLike;
    let createLike;
    if (toggleLike) {
      //delete Like
      deleteLike = await Like.deleteOne({
        tweet: tweetId,
      });
    } else {
      const createLike = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
      });
    }
    res
      .status(200)
      .json(new ApiResponse(200, `${createLike ? "Liked" : "Unlike"}`));
  }
);
//you need info aboout like videos
const getLikedVideos = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const liked = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "videos", // The collection to join with
          localField: "likedBy", // The field from the input documents
          foreignField: "_id", // The field from the documents of the "from" collection
          as: "likedVideos",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner",
                },
              },
            },
          ],
        },
      },
    ]);
    if (!liked) {
      throw new ApiError(500, "liked Videos not found ");
    }
    // console.log(user);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          liked[0]?.likedVideos || {},
          "succesfully watch history obtained"
        )
      );
  }
);
