import { Router } from "express";
import {
  changeUserPassword,
  getChannelProfile,
  getCurrentUser,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountdetails,
  updateUserAvatar,
  updateUserCover,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  //tested
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser); //tested
router.route("/logout").post(verifyJWT, logoutUser); //tested
router.route("/refresh-Token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeUserPassword); //tested
router.route("/current-user").get(verifyJWT, getCurrentUser); //tested
router.route("/update-account").patch(verifyJWT, updateAccountdetails);
router
  .route("/update-avatar")
  .patch(upload.single("avatar"), verifyJWT, updateUserAvatar);
router
  .route("/update-cover")
  .patch(upload.single("coverImage"), verifyJWT, updateUserCover);

router.route(`/profile/:username`).get(verifyJWT, getChannelProfile);
router.route(`/history`).get(verifyJWT, getWatchHistory);
export default router;
