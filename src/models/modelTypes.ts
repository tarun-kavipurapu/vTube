import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullname: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: Schema.Types.ObjectId[];
  refreshToken: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): any;
  generateRefreshToken(): any;
}
export interface Ivideo extends Document {
  videoFile: string;
  thumbnail: string;
  owner: Schema.Types.ObjectId;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
}
export interface Isubsctibe extends Document {
  subscriber: Schema.Types.ObjectId;
  channel: Schema.Types.ObjectId;
}
export interface ILike extends Document {
  comment: Schema.Types.ObjectId;
  video: Schema.Types.ObjectId;
  likedBy: Schema.Types.ObjectId;
  tweet: Schema.Types.ObjectId;
}
export interface IComment extends Document {
  video: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;
  content: string;
}
export interface Itweet extends Document {
  owner: Schema.Types.ObjectId;
  content: string;
}
export interface IPlaylists extends Document {
  videos: Schema.Types.ObjectId[];
  owner: Schema.Types.ObjectId;
  name: string;
  description: string;
}
