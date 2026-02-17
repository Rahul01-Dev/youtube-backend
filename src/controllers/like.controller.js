import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const { _id: userId } = req.user;

    const like = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Like removed successfully"));
    } else {
        await Like.create({
            video: videoId,
            likedBy: userId
        });
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Like added successfully"));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const { _id: userId } = req.user;

    const like = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Like removed successfully"));
    } else {
        await Like.create({
            comment: commentId,
            likedBy: userId
        });
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Like added successfully"));
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const { _id: userId } = req.user;

    const like = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Like removed successfully"));
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: userId
        });
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Like added successfully"));
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const { _id: userId } = req.user;

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: "$owner"
                    }
                ]
            }
        },
        {
            $unwind: "$video"
        },
        {
            $project: {
                video: 1,
                createdAt: 1
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
