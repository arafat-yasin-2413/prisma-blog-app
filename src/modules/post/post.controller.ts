import { Request, Response } from "express";
import { postService } from "./post.service";

const getAllPost = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === "string" ? search : undefined;

        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

        const isFeatures = req.query.isFeatures
            ? req.query.isFeatures === "true"
                ? true
                : req.query.isFeatures === "false"
                  ? false
                  : undefined
            : undefined;

        const status = req.query.status as PostStatus | undefined;

        const authorId = req.query.authorId as string | undefined;

        const result = await postService.getAllPost({ search: searchString, tags, isFeatures, status, authorId });
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: "Get All Post Failed!",
            details: error,
        });
    }
};

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        // console.log(req.user)
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const result = await postService.createPost(req.body, user.id as string);
        res.status(201).json(result);
    } catch (e) {
        res.send(401).json({
            error: "Post creation failed",
            details: e,
        });
    }
};

export const PostController = {
    createPost,
    getAllPost,
};
