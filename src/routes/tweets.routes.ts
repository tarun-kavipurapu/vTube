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
router.use(verifyJWT);
router.route("/createTweet").post(createTweet); //!tested
router.route("/t/:tweetId").delete(deleteTweet).patch(updateTweet); //!tested
router.route("/user/:userId").get(getUserTweets); //!tested
export default router;
