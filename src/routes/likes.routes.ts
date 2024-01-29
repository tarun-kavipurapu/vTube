import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

//toglevideolike

//togglecomment
//toggletweetlike
//getLikedVideos
router.use(verifyJWT);
router.route("/l/:videoId").post();
router.route("/l/:commentId").post();
router.route("/l/:tweetId").post();
router.route("/liked").get();

export default router;
