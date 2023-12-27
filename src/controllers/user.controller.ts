import { asyncHandler } from "./../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { Express } from "express";
import { cloudinaryFileUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/modelTypes.js";

export interface IGetUserAuthInfoRequest extends Request {
  user: any; // or any other type
}
import { Types } from "mongoose";
const generateRefreshandAcessToken = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken() || "";

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

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
  console.log(email, password);

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

  req.files as { [fieldname: string]: Express.Multer.File[] };
  console.log(req);
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

  console.log("control before user");
  if (!avatar) {
    console.log("control here at end");
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
  console.log(accessToken,refreshToken);

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

    await User.findByIdAndUpdate(user._id, { $set: { refreshToken: undefined } },{new:true});


    const options = {
      httpOnly: true, //makign cookies not moodifiable at the froont end side
      secure: true,
    };

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, "Sucessfully logout"));
  }
);
export { registerUser, loginUser, logoutUser };
