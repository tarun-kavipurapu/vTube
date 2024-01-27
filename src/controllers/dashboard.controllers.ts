import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

// const getChannelStats = asyncHandler(async(req:IGetUserAuthInfoRequest,res:Response){
//     const user  = req.user._id;

// });
