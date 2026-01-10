import dotenv from 'dotenv';
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

dotenv.config();

const connectDb=async()=>{
    try {

       const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`\n MongoDb is Connected!!! DB Host : ${conn.connection.host}`);

    } catch (error) {
        console.error("MongoDb Connection Error : ",error);
        process.exit(1);
    }
}

export default connectDb;
