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
router.route("/").post(createPlaylist); //!tested
router
  .route("/:playlistId")
  .get(getPlayListById) //!tested
  .delete(deletePlaylist) //!tested
  .patch(updatePlaylist); //!tested

router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist); //!tested

router.route("/remove/:playlistId/:videoId").patch(removeVideFromPlaylist); //!tested
router.route("/user/:userId").get(getUserPlaylists); //!tested
export default router;
