import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";
import dotenv from 'dotenv'
dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
  console.log(`Inside upload cloudinary file path: ${filePath}`)
  try {
    if(!filePath) return null;
    // upload the file on cloudinary
    const resposne = await cloudinary.uploader
      .upload(`${filePath}`, {
        resource_type: 'auto'
      });
    // if successfully uploaded then
    console.log(`File Uploaded Successfully and url: ${resposne.url}`);
    fs.unlinkSync(filePath); // unlink the localy saved temporary file
    return resposne;
  } catch (error) {
    fs.unlinkSync(filePath); // unlink the localy saved temporary file
    return error;
  }
}

export {uploadOnCloudinary};