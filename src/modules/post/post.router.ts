import express, { Router } from "express"
import auth, { UserRole } from "../../middleware/auth";
import { postController } from "./post.controller";

const router = express.Router();

router.get("/my-posts", auth(UserRole.USER, UserRole.ADMIN), postController.getMyPosts)
router.get("/:postId", postController.getPostById);
router.get("/",postController.getAllPost);
router.post("/", auth(UserRole.USER, UserRole.ADMIN), postController.createPost);



export const postRouter:Router = router;