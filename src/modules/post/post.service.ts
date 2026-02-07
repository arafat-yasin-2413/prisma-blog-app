// import { Post } from "../../../generated/prisma/client";
import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllPost = async (payload : { search: string | undefined}) => {
    const result = await prisma.post.findMany({
        where: {
            title : {
                contains: payload.search as string,
                mode: "insensitive"
            }
        }
    });
    return result ;
}

const createPost = async (data :Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId: string)=>{
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result ;
}


export const postService = {
    createPost,
    getAllPost
}