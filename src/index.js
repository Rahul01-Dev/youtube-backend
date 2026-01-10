import dotenv from 'dotenv'
import express from "express";
import connectDb from './db/dbconnect.js';

dotenv.config();

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 3000 ,()=>{
        console.log(`App is Listen on Port : ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MongoDb connection Failed!!");
});