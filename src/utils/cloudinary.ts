import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';

// Config
dotenv.config({
  path: "./.env",
});
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET})
 const cloudinaryFileUpload = async function (localFilePath:string) {
  try {
    console.log(typeof process.env.CLOUDINARY_API_SECRET)
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response.url);
    // console.log(response.url);
    fs.unlink(localFilePath, (err) => {//remove from local repo after upload
      if (err) {
        console.error(err);
        return;
      }
      // console.log('File Unlinked from local Repository successfully');
    });
    return response;
  } 
  catch (error) {
    fs.unlinkSync(localFilePath);
   
    console.log(error);
    return null; // remove the locally saved temporary file as the upload operation got failed
  }
};
export {cloudinaryFileUpload}
