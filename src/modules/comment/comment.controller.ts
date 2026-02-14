import { Request, Response } from "express";
import { commentServices } from "./comment.service";
import { error } from "node:console";

const getCommentByAuthor = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params;
        const result = await commentServices.getCommentByAuthor(authorId as string);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({
            error: "Getting Comment By Id Failed",
            details: e,
        });
    }
};

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await commentServices.getCommentById(commentId as string);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({
            error: "Getting Comment By Id Failed",
            details: e,
        });
    }
};

const createComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        req.body.authorId = user?.id;
        const result = await commentServices.createComment(req.body);
        return res.status(201).json(result);
    } catch (e) {
        return res.status(400).json({
            error: "Comment creation failed",
            details: e,
        });
    }
};

const updateComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentServices.updateComment(commentId as string, req.body, user?.id as string);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({
            error: "Comment Update Failed",
            details: e,
        });
    }
};

const deleteComment = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
        const result = await commentServices.deleteComment(commentId as string, user?.id as string);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({
            error: "Comment Deletion Failed",
            details: e,
        });
    }
};

const moderateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params;
        const result = await commentServices.moderateComment(commentId as string, req.body);
        res.status(200).json(result);
        
    } catch (e) {
        res.status(400).json({
            error: "Comment Moderation Failed",
            details: e,
        });
    }
};

export const commentControllers = {
    getCommentById,
    getCommentByAuthor,
    createComment,
    updateComment,
    deleteComment,
    moderateComment,
};
