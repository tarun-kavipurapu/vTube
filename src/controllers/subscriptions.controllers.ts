import { asyncHandler } from "../utils/asyncHandler.js";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

const getSubscribedChannels = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    // const {};
  }
);

const toggleSubcription = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    // const {};
  }
);
const getUserChannelSubscribers = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    // const {};
  }
);

export { getSubscribedChannels, toggleSubcription, getUserChannelSubscribers };
