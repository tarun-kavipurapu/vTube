import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
router.use(verifyJWT); //applyig for all the handlers in the routes

router.route("/:videoId").get().post();

export default router;
