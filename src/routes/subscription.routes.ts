import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubcription,
} from "../controllers/subscriptions.controllers.js";
const router = Router();

//getSUbscribedChannels
//toggle subscription
//getuserchanellsubscribers

router.use(verifyJWT);

router
  .route("/c/:channelId")
  .get(getUserChannelSubscribers) //!tested
  .post(toggleSubcription); //!tested
router.route("/s/:subscriberId").get(getSubscribedChannels); //!tested

export default router;
