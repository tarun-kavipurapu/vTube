import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweets.models.js";
import { Request, Response } from "express";
import { User } from "../models/users.models.js";
export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}
import mongoose from "mongoose";

const createTweet = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { content } = req.body;
    if (!content?.trim()) {
      throw new ApiError(400, "Content is not Present");
    }
    const tweet = await Tweet.create({
      content,
      owner: req.user._id,
    });
    if (!tweet) {
      throw new ApiError(500, "Unable to create tweet");
    }

    res.status(200).json(new ApiResponse(200, tweet, "Tweet Created"));
  }
);

const deleteTweet = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    //first check if i am the owner of the tweet or not
    const { tweetId } = req.params;
    if (!tweetId?.trim()) {
      throw new ApiError(400, "TweetId is not given");
    }
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      throw new ApiError(404, "no tweet found!");
    }

    if (tweet?.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to update this tweet!"
      );
    }

    // Attempt to remove the tweet
    const deletionResult = await tweet.deleteOne(); //-->if this does not work just use findByIDandRemove

    // Check if the tweet was successfully removed
    if (!deletionResult) {
      throw new ApiError(
        500,
        "Failed to delete the tweet. Tweet not found or you don't have permission."
      );
    }
    // console.log("delete successfully", deleteTweet)

    res.status(200).json(new ApiResponse(200, deleteTweet, "Tweet Deleted"));
  }
);
const updateTweet = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    if (!tweetId?.trim()) {
      throw new ApiError(400, "TweetId is not given");
    }
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      throw new ApiError(404, "no tweet found!");
    }
    if (tweet?.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to update this tweet!"
      );
    }
    const tweetUpdate = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: { content: content },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, tweetUpdate, "tweet updated sucessfully"));
  }
);
const getUserTweets = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { userId } = req.params;
    if (!userId?.trim()) {
      throw new ApiError(400, "UserId is not given");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const tweet = await Tweet.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId), //or user._id
        },
      },
    ]);

    if (!tweet) {
      throw new ApiError(500, "Unable to get tweets");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "tweet retreived sucessfully"));
  }
);
export { createTweet, updateTweet, deleteTweet, getUserTweets };
