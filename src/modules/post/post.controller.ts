import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {

    try{
        const user = req.user;
        // console.log(req.user)
        if(!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }
        const result = await postService.createPost(req.body, user.id as string)
        res.status(201).json(result) 
    }
    catch(e){
        res.send(401).json({
            error : "Post creation failed",
            details : e
        })
    }
};

export const PostController = {
    createPost,
};
