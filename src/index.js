// ONE APPROACH
import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv'
dotenv.config({path: './.env'});

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8080, ()=>{
    console.log(`Server started at: ${process.env.PORT}`);
  })
})
.catch((err)=>{
  console.error(`DB connection fail ${err}`)
});

// ANOTHER APPROACH

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants"
// require('dotenv').config();

// (async function (){
//   try{
//     const db = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//   } catch(err){
//     console.error(err);
//     throw err
//   }
// })();