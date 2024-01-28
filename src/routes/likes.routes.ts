import { Router } from "express";
const router = Router();

//toglevideolike

//togglecomment
//toggletweetlike
//getLikedVideos

router.route("/l/:videoId").post();
router.route("/l/:commentId").post();
router.route("/l/:tweetId").post();
router.route("/liked").get();

export default router;
