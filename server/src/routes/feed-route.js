import express from "express";
import { protect } from "#middlewares/auth-middleware";
import { uploadSignaturesHandler } from "#controllers/feed-controller";

const router = express.Router();

router.get("/upload-signature", protect, uploadSignaturesHandler);

export default router;
