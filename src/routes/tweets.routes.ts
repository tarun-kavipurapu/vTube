import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweets.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
//create a tweet
//delete a tweet
//update a tweet
//lload the tweets
router.route("/createTweet").post(verifyJWT, createTweet);
router
  .route("/t/:tweetId")
  .delete(verifyJWT, deleteTweet)
  .patch(verifyJWT, updateTweet);
router.route("/user/:userId").get(verifyJWT, getUserTweets);
export default router;
