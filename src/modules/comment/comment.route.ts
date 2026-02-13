import express, { Router } from "express";
import { commentControllers } from "./comment.controller";
import auth, { UserRole } from "../../middleware/auth";
// import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentControllers.createComment);

export const commentRouter:Router = router;