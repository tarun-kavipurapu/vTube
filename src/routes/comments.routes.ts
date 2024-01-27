import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteComment,
  getComments,
  insertComment,
  updateComment,
} from "../controllers/comments.controllers.js";
router.use(verifyJWT); //applyig for all the handlers in the routes

router.route("/:videoId").get(getComments).post(insertComment);

router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
