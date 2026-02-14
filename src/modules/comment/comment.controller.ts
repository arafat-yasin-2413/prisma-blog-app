import { Request, Response } from "express";
import { commentServices } from "./comment.service";





const getCommentByAuthor = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params
        const result = await commentServices.getCommentByAuthor (authorId as string);
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
        const { commentId } = req.params
        const result = await commentServices.getCommentById (commentId as string);
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
        const result = await commentServices.createComment (req.body);
        return res.status(201).json(result);
    
    } catch (e) {
        return res.status(400).json({
            error: "Comment creation failed",
            details: e,
        });
    }
};





export const commentControllers = {
    createComment,
    getCommentById,
    getCommentByAuthor
}