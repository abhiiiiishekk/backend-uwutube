import { v2 as cloudinary } from 'cloudinary'
import fs from "fs";

cloudinary.config({secure: true})

const uploadOnCloudinary = async (filePath) => {
  try {
    if(!filePath) return null;
    // upload the file on cloudinary
    const resposne = await cloudinary.uploader
      .upload(`${filePath}`, {
        resource_type: 'auto'
      });
    // if successfully uploaded then
    console.log(`File Uploaded Successfully and url: ${resposne.url}`);
    return resposne;
  } catch (error) {
    fs.unlinkSync(localStorage); // unlink the localy saved temporary file
    return null;
  }
}

export {uploadOnCloudinary};