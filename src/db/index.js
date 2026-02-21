import mongoose from "mongoose";

const connectDB = async () =>{
  try {
    const db = await mongoose.connect(`${process.env.MONGO_URI}`)
    console.log(`Connected: ${db.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default connectDB;