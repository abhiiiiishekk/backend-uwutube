import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(`Inside generate: ${user}`);
    
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    // user.accessToken = accessToken;
    console.log(`Access Token ${accessToken}`);
    console.log(`Refresh Token ${refreshToken}`);
    
    await user.save({ validateBeforeSave: false });
    console.log("After save");
    
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresth and access token: "+error
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
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
  const { fullName, username, email, password } = req.body;

  // validation
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const findUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  console.log(findUser);

  if (findUser) throw new ApiError(409, "User Already Registered: ");

  console.log("Before upload");
  const avatarLocalPath = await uploadOnCloudinary(req.files?.avatar[0]?.path);
  const coverImageLocalPath = await uploadOnCloudinary(
    req.files?.coverImage[0]?.path
  );
  console.log("After upload");

  const registeredUser = await User.create({
    username,
    email,
    fullName,
    password,
    avatar: avatarLocalPath?.url || "",
    coverImage: coverImageLocalPath?.url || "",
  });

  if (!registerUser)
    throw new ApiError(400, "Something went wrong while creating user");

  return res
    .status(200)
    .json(new ApiResponse(201, registeredUser, "User Created"));
});

const loginUser = asyncHandler(async (req, res) => {
  /*
   * take email id and password from request body
   * checks whether the fields are empty or not
   * verify the user using email
   * check the password
   * if success, then generate access and refresh token
   * store the refresh token in the database
   * send cookie to the user browser
   * logged the user in successfully
   */
  
  const { email, password } = req.body;
  const username = req.body?.username;
  console.log(`Email ${email}`);
  
  if (!email) {
    throw new ApiError(404, "Email is required");
  }
  const findUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  console.log(`find user: ${findUser}`);
  
  if (!findUser) throw new ApiError(400, "User doesn't exist");

  const isPassValid = await findUser.isPasswordCorrect(password);
  if (!isPassValid) throw new ApiError(401, "Password Incorrect");
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    findUser._id
  );

  const loggedInUser = await User.findById(findUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true, // only modifiable through server
  };

  return res
    .status(200)
    .cookie("acessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, //returns new updated value
    }
  );
  const options = {
    httpOnly: true,
    secure: true, // only modifiable through server
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged Out Successfully"));
});

export { registerUser, loginUser, logoutUser };
