import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import {User} from "../models/user.model.js"

const registerUser = asyncHandler( async(req, res) =>{
  /**
   * get user details from request body
   * validation
   * check whether user already exist or not: email and username check
   * check for avatar (required) and coverimage
   * upload files to cloudinary
   * create user object in db
   * remove password and refresh token from response
   * check whether user get created or not
   * return response
   */
  const {fullName, username, email, password} = req.body;

  // validation
  if([fullName, username, email, password].some((field)=> field === "" )){
    throw new ApiError(409, "All Fields are required")
  }
  
  console.log("Before upload")
  const avatarLocalPath = await uploadOnCloudinary(req.files.avatar[0].path);
  const coverImageLocalPath = await uploadOnCloudinary(req.files.coverImage[0].path);
  console.log("After upload")

  const findUser = User.findOne({
    $or: [{ email }, { username }]
  })

  console.log(findUser.schema.obj)
  if(findUser) throw new ApiError(400, "User Already Registered: ")

  const registeredUser = await User.create({
    username,
    email,
    fullName,
    password,
    avatar: avatarLocalPath.url,
    coverImage: coverImageLocalPath.url
  })

  if(!registerUser) throw new ApiError(400, "Something went wrong while creating user")

  return res.status(200).json(
    new ApiResponse(201, registeredUser, "User Created")
  )
})

export { registerUser }