import { Request, Response } from "express";
import { commentServices } from "./comment.service";


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
    createComment
}