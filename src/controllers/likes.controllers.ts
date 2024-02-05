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
  user: any;
}

const toggleVideoLike = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const { videoId } = req.params;

      if (!videoId) {
        throw new ApiError(400, "videoId missing");
      }

      const video = await Video.findById(videoId);

      if (!video) {
        throw new ApiError(404, "Video not found");
      }

      const toggleLike = await Like.findOne({
        video: videoId,
      });

      let likeStatus;

      if (toggleLike) {
        // User has already liked the video, delete the like
        const deleteLike = await Like.deleteOne({
          video: videoId,
          likedBy: req.user._id,
        });

        if (deleteLike.deletedCount === 0) {
          throw new ApiError(500, "Failed to unlike the video");
        }

        likeStatus = false; // User unliked the video
      } else {
        // User has not liked the video, create a like
        const createLike = await Like.create({
          video: videoId,
          likedBy: req.user._id,
        });

        if (!createLike) {
          throw new ApiError(500, "Failed to like the video");
        }

        likeStatus = true; // User liked the video
      }

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { liked: likeStatus },
            `${likeStatus ? "Liked" : "Unliked"}`
          )
        );
    } catch (error) {
      if (error instanceof ApiError) {
        res
          .status(error.statusCode)
          .json(new ApiResponse(error.statusCode, error.message));
      } else {
        console.error(error);
        res.status(500).json(new ApiResponse(500, "Internal Server Error"));
      }
    }
  }
);

const toggleCommentLike = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const { commentId } = req.params;

      if (!commentId) {
        throw new ApiError(400, "commentId missing");
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        throw new ApiError(404, "Comment not found");
      }

      const toggleLike = await Like.findOne({
        comment: commentId,
      });

      let likeStatus;

      if (toggleLike) {
        // User has already liked the comment, delete the like
        const deleteLike = await Like.deleteOne({
          comment: commentId,
          likedBy: req.user._id,
        });

        if (deleteLike.deletedCount === 0) {
          throw new ApiError(500, "Failed to unlike the comment");
        }

        likeStatus = false; // User unliked the comment
      } else {
        // User has not liked the comment, create a like
        const createLike = await Like.create({
          comment: commentId,
          likedBy: req.user._id,
        });

        if (!createLike) {
          throw new ApiError(500, "Failed to like the comment");
        }

        likeStatus = true; // User liked the comment
      }

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { liked: likeStatus },
            `${likeStatus ? "Liked" : "Unliked"} the comment`
          )
        );
    } catch (error) {
      if (error instanceof ApiError) {
        res
          .status(error.statusCode)
          .json(new ApiResponse(error.statusCode, error.message));
      } else {
        console.error(error);
        res.status(500).json(new ApiResponse(500, "Internal Server Error"));
      }
    }
  }
);

const toggleTweetLike = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const { tweetId } = req.params;

      if (!tweetId) {
        throw new ApiError(400, "tweetId missing");
      }

      const tweet = await Tweet.findById(tweetId);

      if (!tweet) {
        throw new ApiError(404, "Tweet not found");
      }

      const toggleLike = await Like.findOne({
        tweet: tweetId,
      });

      let likeStatus;

      if (toggleLike) {
        // User has already liked the tweet, delete the like
        const deleteLike = await Like.deleteOne({
          tweet: tweetId,
        });

        if (!deleteLike || deleteLike.deletedCount === 0) {
          throw new ApiError(500, "Failed to unlike the tweet");
        }

        likeStatus = false; // User unliked the tweet
      } else {
        // User has not liked the tweet, create a like
        const createLike = await Like.create({
          tweet: tweetId,
          likedBy: req.user._id,
        });

        if (!createLike) {
          throw new ApiError(500, "Failed to like the tweet");
        }

        likeStatus = true; // User liked the tweet
      }

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { liked: likeStatus },
            `${likeStatus ? "Liked" : "Unliked"} the tweet`
          )
        );
    } catch (error) {
      if (error instanceof ApiError) {
        res
          .status(error.statusCode)
          .json(new ApiResponse(error.statusCode, error.message));
      } else {
        console.error(error);
        res.status(500).json(new ApiResponse(500, "Internal Server Error"));
      }
    }
  }
);
//you need info aboout like videos
const getLikedVideos = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const liked = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(req.user._id),
          video: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "videos", // The collection to join with
          localField: "video", // The field from the input documents
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

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
