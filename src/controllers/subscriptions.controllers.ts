import { subscribe } from "diagnostics_channel";
import { Subscribe } from "../models/subscription.models.js";
import { User } from "../models/users.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const { subscriberId } = req.params;
      // Check if subscriberId is provided
      if (!subscriberId) {
        throw new ApiError(400, "Subscriber ID is required");
      }

      // Retrieve subscriptions using aggregation pipeline
      const subscriptions = await Subscribe.aggregate([
        {
          $match: {
            subscriber: new mongoose.Types.ObjectId(subscriberId),
          },
        },
        {
          $group: {
            _id: "$subscriber",
            subscribedChannels: {
              $push: "$channel",
            },
          },
        },
        {
          $project: {
            subscribedChannels: 1,
          },
        },
      ]);

      // Check if subscriptions array is empty
      if (subscriptions.length === 0) {
        throw new ApiError(404, "No subscriptions found");
      }

      // Return subscribed channels in the response
      res
        .status(200)
        .json(
          new ApiResponse(200, subscriptions[0].subscribedChannels, "success")
        );
    } catch (error) {
      // Handle errors
      if (error instanceof ApiError) {
        // If it's an expected API error, send the error response
        res
          .status(error.statusCode)
          .json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        // If it's an unexpected error, send a generic error response
        console.error("An unexpected error occurred:", error);
        res
          .status(500)
          .json(new ApiResponse(500, null, "Internal Server Error"));
      }
    }
  }
);

const toggleSubcription = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { channelId } = req.params;
    if (!channelId) {
      throw new ApiError(400, "Channel ID is required");
    }
    const user = await User.findById(channelId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const existingSubscription = await Subscribe.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
          subscriber: new mongoose.Types.ObjectId(req.user._id),
        },
      },
    ]);

    let subStatus;
    if (existingSubscription.length) {
      await Subscribe.deleteOne({
        subscriber: req.user._id,
        channel: channelId,
      });
      subStatus = false;
    } else {
      await Subscribe.create({
        subscriber: req.user._id,
        channel: channelId,
      });
      subStatus = true;
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subStatus,
          `${subStatus ? "Subscribed" : "Unsubscribed"} successfully`
        )
      );
  }
);

//channel ki subscriber list
const getUserChannelSubscribers = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const { channelId } = req.params;
      if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
      }

      const user = await User.findById(channelId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      const channel = await Subscribe.aggregate([
        {
          $match: {
            channel: new mongoose.Types.ObjectId(channelId),
          },
        },
        {
          $group: {
            _id: "$channel",
            subscribers: {
              $push: "$subscriber",
            },
          },
        },
        {
          $project: {
            subscribers: 1,
          },
        },
      ]);

      res.status(200).json(new ApiResponse(200, channel, "success"));
    } catch (error) {
      if (error instanceof ApiError) {
        res
          .status(error.statusCode)
          .json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        console.error("An unexpected error occurred:", error);
        res
          .status(500)
          .json(new ApiResponse(500, null, "Internal Server Error"));
      }
    }
  }
);

export { getSubscribedChannels, toggleSubcription, getUserChannelSubscribers };
