import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

const getPlayListById = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user._id;
  }
);
const deletePlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user._id;
  }
);
const updatePlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user._id;
  }
);

const getUserPlaylists = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user._id;
  }
);

const addVideoToPlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user._id;
  }
);

const createPlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = req.user._id;
  }
);
const removeVideFromPlaylist = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {}
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
