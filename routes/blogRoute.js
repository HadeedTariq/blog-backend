import { Router } from "express";
import {
  createBlogPost,
  getAllBlogPosts,
} from "../controllers/blogController.js";

const router = Router();

router.post("/create", createBlogPost);
router.get("/", getAllBlogPosts);

export { router as blogRoute };
