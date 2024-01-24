import { asyncHandler } from "./../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { Express } from "express";
import { cloudinaryFileUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/modelTypes.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}
import { Types } from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
const generateRefreshandAcessToken = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken() || "";

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Refresh and Acess tokens"
    );
  }
};

//tested
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  //get user detials from frontend
  //validate -->not empty
  //check if user exists
  //check images,check for avatar
  //upload image to cloudinary
  //create user object -create in db
  //remove password from refresh token field from response
  // check for user creation
  //result response
  const { username, password, email, fullname } = req.body;
  // console.log(email, password);

  if (
    [username, password, email, fullname].some((field) => field.trim() === "")
  ) {
    res.status(400);
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already  Exist");
  }
  // console.log("control here");

  // req.files as { [fieldname: string]: Express.Multer.File[] };
  // console.log(req);
  const avatarLocalPath = (
    req.files as { [fieldname: string]: Express.Multer.File[] }
  )?.avatar[0]?.path;
  // const coverImageLocalPath = (req.files as { [fieldname: string]: Express.Multer.File[] })?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File not available on multer");
  }
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.coverImage[0]?.path;
  }
  const avatar = await cloudinaryFileUpload(avatarLocalPath);
  const coverImage = await cloudinaryFileUpload(coverImageLocalPath);

  if (!avatar) {
    // console.log("control here at end");
    throw new ApiError(400, "IMage not uploaded on cloudinary");
  }

  // console.log('control before user',avatar);

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // console.log('control after user')
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // console.log('control after createduser')

  if (!createdUser) {
    throw new ApiError(500, "Error while creating User");
  }
  // console.log('control created user check here');

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

//tested
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  ///take from req->body
  //find user from db
  //compare password
  //generate refresh and acess tkens
  //send cookie

  const { email, password, username } = req.body;
  // console.log(req.body);
  if (!(username || email)) {
    throw new ApiError(422, "Please enter the  username/Email");
  }
  const user = await User.findOne({
    $or: [
      {
        username,
      },
      {
        email,
      },
    ],
  });
  if (!user) {
    throw new ApiError(422, "Please enter correct user id");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  // console.log("is password correct answer",isPasswordCorrect)
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateRefreshandAcessToken(
    user._id
  );
  console.log(accessToken, refreshToken);

  //either we can update the user object to new user object which containns refresh token or we can just perform database query again decision should be made according to the expensive ness of the operation

  const loggedInuser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true, //makign cookies not moodifiable at the froont end side
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInuser,
          accessToken,
          refreshToken,
        },
        "User Logged in succesfully"
      )
    );
});

const logoutUser = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    await User.findByIdAndUpdate(
      user._id,
      { $set: { refreshToken: undefined } },
      { new: true }
    );

    const options = {
      httpOnly: true, //makign cookies not moodifiable at the froont end side
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "Sucessfully logout"));
  }
);

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshTokenFromUser =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshTokenFromUser) {
    throw new ApiError(401, "Refresh tokenn not provided");
  }
  const decodedObject = jwt.verify(
    refreshTokenFromUser,
    process.env.REFRESH_TOKEN_SECRET
  ); //this is payload section in generate jwt section

  const user = await User.findById(decodedObject._id);
  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
  //comparing refresh token
  if (user.refreshToken != refreshTokenFromUser) {
    throw new ApiError(401, "Invalid refresh token from user Non authorizable");
  }
  //since refresh token is true then generate acess token and send to frontend
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateRefreshandAcessToken(user._id);

  const options = {
    httpOnly: true, //makign cookies not moodifiable at the froont end side
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          newRefreshToken,
          newAccessToken,
        },
        "New set of token created"
      )
    );
});

const changeUserPassword = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(401, "");
    }
    const isPasswordCorrect = user.comparePassword(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Your old password is invalid");
    }
    user.password = newPassword; //there is no need to ahsh the passord as it is taken care of userschema.pre functionn we designed in usermodel which hashes before the saving

    await user.save({ validateBeforeSave: true });

    return res
      .status(200)
      .json(new ApiResponse(200, "Password changed Sucessfully"));
  }
);

const getCurrentUser = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "Current User Info"));
  }
);

//if iamm updating a file like image it is usually better to make sepearte idate handler than text
const updateAccountdetails = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { newFullname, newEmail } = req.body;

    if (!newEmail || !newFullname) {
      throw new ApiError(400, "Please provide new email or fullname");
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { email: newEmail, fullname: newFullname },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account details updated sucessfully"));
  }
);

const updateUserAvatar = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    //take the avatar from user
    //upload it to mmulter in local path
    //upload it to cloudinary
    //replace the image url in database with new cloudinary url

    const avatarLocalPath = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.avatar[0]?.path;

    const avatar = await cloudinaryFileUpload(avatarLocalPath);
    //TODO:delete the previous avatar from cloudinary
    if (!avatar) {
      throw new ApiError(400, "Avatar File not available on multer");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { avatar: avatar.url },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Avatar updated sucessfully"));
  }
);
const updateUserCover = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    //take the avatar from user
    //upload it to mmulter in local path
    //upload it to cloudinary
    //replace the image url in database with new cloudinary url

    const coverLocalPath = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )?.avatar[0]?.path;

    const coverImage = await cloudinaryFileUpload(coverLocalPath);
    //TODO:delete the previous image from cloudinary

    if (!coverImage) {
      throw new ApiError(400, "coverImage File not available on multer");
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { coverImage: coverImage.url },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "CoverImage updated sucessfully"));
  }
);

//user chaneel profile info

const getChannelProfile = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { username } = req.params;
    if (!username.trim()) {
      throw new ApiError(400, "username Invalid");
    }
    const stats = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subcribers",
        },
        //people who subscribed
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribedTo",
        },
        //people i subscribed too
      },
      {
        $addFields: {
          subscribersCount: { $size: "$subscribers" },
          subscribedToCount: { $size: "$subscribedTo" },
          isSubscribed: {
            $cond: {
              if: { $in: [req?.user, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullname: 1,
          username: 1,
          subscribedToCount: 1,
          subscribersCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
        },
      },
    ]);
    if (stats?.length == 0) {
      throw new ApiError(400, "stats not found");
    }

    return res.status(200).json(new ApiResponse(200, stats[0]));
  }
);
const getWatchHistory = asyncHandler(
  async (req: IGetUserAuthInfoRequest, res: Response) => {
    const user = User.aggregate([
      {
        $match: {
          $id: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
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
                      fullname: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
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
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          user[0].watchHistory,
          "succesfully watch history obtained"
        )
      );
  }
);

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
  getCurrentUser,
  updateAccountdetails,
  updateUserAvatar,
  updateUserCover,
  getChannelProfile,
  getWatchHistory,
};
