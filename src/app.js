import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
  // origin: process.env.CORS_ORIGIN -> NOT AVAILABLE RIGHT NOW
  credentials: true
}))

app.use(express.json({
  limit: "10kb"
}))

app.use(express.urlencoded({
  extended: true,
  limit: "15kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

//routes
import userRouter from './routes/user.route.js';

// routes declaration
app.use("/users", userRouter)

export {app}