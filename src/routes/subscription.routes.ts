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
  .get(getUserChannelSubscribers)
  .post(toggleSubcription);
router.route("/c/:subscriberId").get(getSubscribedChannels);

export default router;
