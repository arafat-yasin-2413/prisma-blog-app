import express, { Router } from "express";
import { commentControllers } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";
// import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/author/:authorId", commentControllers.getCommentByAuthor);
router.get("/:commentId", commentControllers.getCommentById);
router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentControllers.createComment);
router.patch("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentControllers.updateComment);
router.delete("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentControllers.deleteComment);

export const commentRouter: Router = router;
