import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/users.models.js";
import { IUser } from "../models/modelTypes.js";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}

export const verifyJWT = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    //get token from header or cookies
    //from that token decode the orignal object that we used in jwt to encode
    //if we get that original object there contains details of database hence using that id we can find the details
    //send these details in req object ex:req.user
    console.log(req.cookies);

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Invalid Acess token");
    }

    const decodedObject = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedObject._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Decoded Object not found");
    }

    req.user = user;
    next();
  }
);
