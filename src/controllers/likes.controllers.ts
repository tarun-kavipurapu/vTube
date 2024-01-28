import { asyncHandler } from "../utils/asyncHandler.js";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

const toggleVideoLike = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    // const {};
  }
);
const toggleCommentLike = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    // const {};
  }
);

const toggleTweetLike = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    // const {};
  }
);

const getLikedVideos = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    // const {};
  }
);
