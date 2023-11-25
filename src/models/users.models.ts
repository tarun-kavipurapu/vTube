import mongoose, { Schema, Document,Query,HydratedDocument } from "mongoose";
import { IUser } from "./modelTypes.js";
import bcrypt from "bcrypt";
import { NextFunction } from "express";
import jwt from 'jsonwebtoken';


const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: [true, "Avatar is required"],
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save",async function(next: NextFunction) {

  if (!this.isModified("password")) return next();

  try{
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
}
  catch{
    const err = new Error('something went wrong');
    // If you call `next()` with an argument, that argument is assumed to be
    // an error.
    next(err);
  }
});
//something significant to note over her is that here we are writing functions but not arrwo functions becuase normal functions give us acess to this keyboard rather unlike the arrwo fucntions  
userSchema.methods.comparePassword=async function(password:string){
return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken= function(){
const payload={
_id:this._id,
username:this.username,
email:this.email,
fullname:this.fullname
}

jwt.sign(
  payload,
  process.env.ACCESS_TOKEN_SECRET||"default value",
  {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
  )
}
userSchema.methods.generateRefreshToken= function(){
const payload={
_id:this._id,

}

jwt.sign(
  payload,
  process.env.REFRESH_TOKEN_SECRET||"default value",
  {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
  }
  )
} 
const User = mongoose.model<IUser>("User", userSchema);