import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app: Express = express();

app.use(express.json());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.static("public"));

///import Router
import userRoutes from "./routes/user.routes.js";
import likesRoutes from "./routes/likes.routes.js";
import videosRoutes from "./routes/videos.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import subscribeRoutes from "./routes/subscription.routes.js";
import tweetRoutes from "./routes/tweets.routes.js";
import playlistRoutes from "./routes/playlists.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/likes", likesRoutes);
app.use("/api/v1/videos", videosRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/subscriptions", subscribeRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
export default app;
