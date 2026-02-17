import express, { urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


// Routes import

import userRoute from "./routes/user.routes.js";
import videoRoute from "./routes/video.routes.js";
import tweetRoute from "./routes/tweet.routes.js";
import subscriptionRoute from "./routes/subscription.routes.js";
import playlistRoute from "./routes/playlist.routes.js";
import likeRoute from "./routes/like.routes.js";
import commentRoute from "./routes/comment.routes.js";
import dashboardRoute from "./routes/dashboard.routes.js";


// routes Declare

app.use("/api/v1/users", userRoute);
app.use("/api/v1/videos", videoRoute);
app.use("/api/v1/tweets", tweetRoute);
app.use("/api/v1/subscriptions", subscriptionRoute);
app.use("/api/v1/playlists", playlistRoute);
app.use("/api/v1/likes", likeRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    let error = err;

    // If it's an ApiError instance
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            data: err.data,
            message: err.message,
            success: err.success,
            errors: err.errors
        });
    }

    // Default error response
    res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        success: false
    });
});

export { app }