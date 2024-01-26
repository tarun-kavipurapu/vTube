import { asyncHandler } from "./../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Request, Response } from "express";

const getComments = asyncHandler(async (req: Request, re: Response) => {
  //we need to get comments regarding a particular video id
});
