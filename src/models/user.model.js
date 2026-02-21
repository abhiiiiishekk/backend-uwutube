import {Schema, model} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true // make searching optimised
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String, // cloudinary url
      requried: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    refreshToken: {
      type: String
    }
  },
  {timestamps: true}
)

userSchema.pre("save", async function(next){

  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 15);
  next();
})

userSchema.methods.isPasswordCorrect = async function(pass) { // user defined method
  return await bcrypt.compare(pass, this.password)
}

userSchema.methods.generateAccessToken = function(next){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,//access token
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}
userSchema.methods.generateRefreshToken = function(next){
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,//refresh token
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = model("User", userSchema);