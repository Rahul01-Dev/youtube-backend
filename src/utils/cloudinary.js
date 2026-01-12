import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // remove local file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // safely remove file only if it exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary upload failed:", error.message);
    return null;
  }
};


export {uploadOnCloudinary}