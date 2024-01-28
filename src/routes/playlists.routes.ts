import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlayListById,
  getUserPlaylists,
  removeVideFromPlaylist,
  updatePlaylist,
} from "../controllers/playlists.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

//addVideoToPlaylist-->done
//createPlaylist-->done
//deletePlaylist-->done
//getPlayListById-->done
//getUserPlaylists-->done
//removeVideFromPlaylist,
//updatePlaylist

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/").post(createPlaylist);
router
  .route("/:playlistId")
  .get(getPlayListById)
  .delete(deletePlaylist)
  .patch(updatePlaylist);

router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);

router.route("/remove/:playlistId/:videoId").patch(removeVideFromPlaylist);
router.route("/user/:userId").get(getUserPlaylists);
export default router;
