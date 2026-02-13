import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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

        // pagination and sorting : reusable
        // const options = paginationSortingHelper(req.query);
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
        // console.log(options);

        const result = await postService.getAllPost({
            search: searchString,
            tags,
            isFeatures,
            status,
            authorId,
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
        });
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

const getPostById = async (req:Request, res:Response) =>{
    try{
        const { postId } = req.params;

        if(!postId) {
            throw new Error("Post Id is Required!");
        }

        const result = await postService.getPostById(postId as string);
        res.status(200).json(result);
    }
    catch(error){
        res.status(400).json({
            error: "Get post by id failed",
            details: error
        })
    }
}

export const PostController = {
    createPost,
    getAllPost,
    getPostById,
};
