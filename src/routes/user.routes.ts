import { Router } from "express";
import {
  changeUserPassword,
  getCurrentUser,
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
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-Token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountdetails);
router
  .route("/update-avatar")
  .patch(upload.single("avatar"), verifyJWT, updateUserAvatar);
router
  .route("/update-cover")
  .patch(upload.single("coverImage"), verifyJWT, updateUserCover);
  
export default router;
