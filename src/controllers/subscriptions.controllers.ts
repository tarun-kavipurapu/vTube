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
//user ne kis kis ko subscribe kiya
const getSubscribedChannels = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { subscriberId } = req.params;
    if (!subscriberId) {
    }
    const subscriptions = await Subscribe.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(subscriberId),
        },
      },
      {
        $lookup: {
          from: "users", // The collection to join with
          localField: "channel", // The field from the input documents
          foreignField: "_id", // The field from the documents of the "from" collection
          as: "usersubscribedTo", // The name of the new array field to add to the input documents
          pipeline: [
            {
              $project: {
                fullname: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          subscribedChannelLists: {
            $first: "$usersubscribedTo",
          },
        },
      },
    ]);
    if (!subscriptions) {
      throw new ApiError(404, "No subscriptions found");
    }
    res.status(200).json(new ApiResponse(200, subscriptions[0], "success"));
    //TODO:look further how to give better response
  }
);

const toggleSubcription = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { channelId } = req.params;
    const existingSubscription = await Subscribe.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(req.user._id),
          subscriber: new mongoose.Types.ObjectId(channelId),
        },
      },
    ]);
    let subscribed;
    let unSubscribe;
    if (existingSubscription) {
      unSubscribe = await Subscribe.deleteOne({
        subscriber: channelId,
        channel: req.user._id,
      });
    } else {
      subscribed = await Subscribe.create({
        subscriber: channelId,
        channel: req.user._id,
      });
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `${unSubscribe ? "unSubscribe" : "Subscribe"} successfully`
        )
      );
  }
);
//channel ki subscriber list
const getUserChannelSubscribers = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { channelId } = req.params;
    if (!channelId) {
    }
    const user = await User.findById(channelId);
    if (!user) {
    }

    const channel = await Subscribe.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $lookup: {
          from: "users", // The collection to join with
          localField: "subscriber", // The field from the input documents
          foreignField: "_id", // The field from the documents of the "from" collection
          as: "channelSubscribers",
          pipeline: [
            {
              $project: {
                username: 1,
                fullname: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          channelSubscribers: {
            $first: "$channelSubscribers",
          },
        },
      },
    ]);
  }
);

export { getSubscribedChannels, toggleSubcription, getUserChannelSubscribers };
