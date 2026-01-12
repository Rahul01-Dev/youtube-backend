import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req,res)=>{
    
    const {fullName,username,password,email} = req.body;

    if(
        [fullName,username,password,email].some((field)=>field?.trim()===" ")
    ){
        throw new apiError(400,"All field are required!")
    }

    const existUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existUser){
        throw new apiError(409,"User with username or email is Exist");
    }

    const avatarlocalpath=req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarlocalpath){
        throw new apiError(400,"Avatar file is required!")
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new apiError(400,"Avatar file is required!");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(500,"Something went wrong while registration")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"Registration is successfull")
    )

})

export {registerUser};