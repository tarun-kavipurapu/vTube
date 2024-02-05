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
router.route("/l/v/:videoId").post(toggleVideoLike); //!tested
router.route("/l/c/:commentId").post(toggleCommentLike); //!tested
router.route("/l/t/:tweetId").post(toggleTweetLike); //!tested
router.route("/liked").get(getLikedVideos); //!tested

export default router;
