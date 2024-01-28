import { asyncHandler } from "./../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Request, Response } from "express";
import { Comment } from "../models/comments.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

const getComments = asyncHandler(async (req: Request, res: Response) => {
  //user need to get comments regarding a particular video id
  //input-->vvideoid , limit , page

  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId.trim()) {
    throw new ApiError(400, "videoId missing");
  }
  const parsedPage = parseInt(page as string, 10);
  const parsedLimit = parseInt(limit as string, 10);

  //getting all the comments with video ID
  const comments = await Comment.aggregate([
    {
      $match: {
        video: videoId,
      },
    },
    { $skip: (parsedPage - 1) * parsedLimit },
    {
      $limit: parsedLimit,
    },
    {
      $project: {
        _id: 1,
        content: 1,
        owner: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, comments[0], "Sucessfully fetched comments"));
});
const insertComment = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    //get video id from params then take content from req.body and take user from req.user
    //then create a databse object
    const { videoId } = req.params;
    const user = req.user;
    const { content } = req.body;

    if (!videoId.trim()) {
      throw new ApiError(400, "videoId missing");
    }
    if (!content.trim()) {
      throw new ApiError(400, "Content missing");
    }
    const comment = await Comment.create({
      content,
      video: videoId,
      owner: user._id,
    });

    res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment sucessfully created"));
  }
);

const deleteComment = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!commentId.trim()) {
      throw new ApiError(400, "commentId missing");
    }

    if (!comment) {
      throw new ApiError(404, "no comment found!");
    }
    if (comment?.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to delete this comment!"
      );
    }

    const commentDelete = await Comment.findByIdAndDelete(commentId);

    if (!commentDelete) {
      throw new ApiError(500, "COmment not deleted");
    }

    res.status(200).json(new ApiResponse(200, "Sucessfully Deleted Comment"));
  }
);

const updateComment = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;
    if (!commentId.trim()) {
      throw new ApiError(400, "commentId missing");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, "no comment found!");
    }
    if (comment?.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to update this comment!"
      );
    }

    //TODO:Write the appropriate errors if commentID and content are not there
    const commentUpdate = await Comment.findByIdAndUpdate(
      commentId.trim(),
      {
        $set: { content: content },
      },
      { new: true }
    );
    if (!commentUpdate) {
      throw new ApiError(500, "Something wrong with updating ");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, commentUpdate, "Comment updated sucessfully"));
  }
);
export { getComments, insertComment, deleteComment, updateComment };
