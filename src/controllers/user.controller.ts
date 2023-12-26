import {asyncHandler} from "./../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { Express } from 'express';
import { cloudinaryFileUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { Response } from "express";
import { Request, Response, NextFunction } from "express";

// interface File{
//   multerFile: Express.Multer.File;
// } 
export const registerUser = asyncHandler(async (req:Request, res:Response) => {
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
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409,"User already  Exist");  
  }
  // console.log("control here");

  console.log(req);
  const avatarLocalPath = (req.files as { [fieldname: string]: Express.Multer.File[] })?.avatar[0]?.path;
  const coverImageLocalPath = (req.files as { [fieldname: string]: Express.Multer.File[] })?.coverImage[0]?.path;
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar File not available on multer")
  }
  
  const avatar  = await cloudinaryFileUpload(avatarLocalPath);
  const coverImage = await cloudinaryFileUpload(coverImageLocalPath);
  
  console.log('control before user');
  if(!avatar){
    console.log("control here at end");
    throw new ApiError(400,"IMage not uploaded on cloudinary")
  }
  // console.log('control before user',avatar);

  const user =  await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email, 
    password,
    username: username.toLowerCase()
},)
  // console.log('control after user')
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );
  // console.log('control after createduser')

 
  if(!createdUser){
    throw new ApiError(500,"Error while creating User");
  }
  // console.log('control created user check here');
  
  
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
)
});
