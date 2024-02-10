import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";
import fs from "fs";
import dotenv from "dotenv";

// Config
dotenv.config({
  path: "./.env",
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinaryFileUpload = async function (localFilePath: string) {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response.url);
    // console.log(response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);

    console.log(error);
    return null; // remove the locally saved temporary file as the upload operation got failed
  }
};

const cloudinaryFileDelete = async function (
  publicId: string,
  resource_type: string
) {
  try {
    if (!publicId) return null;
    const response = cloudinary.api
      .delete_resources([`${publicId}`], {
        type: "upload",
        resource_type: `${resource_type}`,
      })
      .then(console.log);
    console.log("file is deleted from cloudinary ", publicId);
    return response;
  } catch (error) {
    console.log("error in deleting file from cloudinary", error);
    return null;
  }
};
export { cloudinaryFileUpload, cloudinaryFileDelete };
