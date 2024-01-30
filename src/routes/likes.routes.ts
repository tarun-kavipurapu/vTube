import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/likes.controllers.js";
const router = Router();
router.use(verifyJWT);
router.route("/l/:videoId").post(toggleVideoLike);
router.route("/l/:commentId").post(toggleCommentLike);
router.route("/l/:tweetId").post(toggleTweetLike);
router.route("/liked").get(getLikedVideos);

export default router;
