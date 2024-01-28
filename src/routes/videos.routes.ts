import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteById,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  updateThumbnail,
  uploadVideo,
} from "../controllers/videos.controllers.js";
router.use(verifyJWT);
router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    uploadVideo
  );
router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteById)
  .patch(upload.single("thumbnail"), updateThumbnail);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
export default router;
