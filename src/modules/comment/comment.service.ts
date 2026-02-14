import { CommentStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getCommentById = async (id: string) => {
    return await prisma.comment.findUnique({
        where: {
            id,
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true,
                },
            },
        },
    });
};

const getCommentByAuthor = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId,
        },
        orderBy: { createdAt: "desc" },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
};

const createComment = async (payload: { content: string; authorId: string; postId: string; parentId: string }) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId,
        },
    });

    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId,
            },
        });
    }

    return await prisma.comment.create({
        data: payload,
    });
};

const updateComment = async (
    commentId: string,
    data: { content?: string; status?: CommentStatus },
    authorId: string,
) => {
    // console.log({commentId, data, authorId})

    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId,
        },
        select: {
            id: true,
        },
    });

    // console.log(commentData);

    if (!commentData) {
        throw new Error("Your provided input is invalid");
    }

    return await prisma.comment.update({
        where: {
            id: commentData.id,
            authorId,
        },
        data,
    });
};

const deleteComment = async (commentId: string, authorId: string) => {
    // console.log({commentId, authorId})
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId,
        },
        select: {
            id: true,
        },
    });

    // console.log(commentData);

    if (!commentData) {
        throw new Error("Your provided input is invalid");
    }

    return await prisma.comment.delete({
        where: {
            id: commentData.id,
        },
    });
};

const moderateComment = async (id: string, data: { status: CommentStatus }) => {
    // console.log({id, data})
    const commentData = await prisma.comment.findUniqueOrThrow({
        where: {
            id,
        },
    });

    // console.log({commentData})

    return await prisma.comment.update({
        where: {
            id,
        },
        data,
    });
};

export const commentServices = {
    getCommentById,
    getCommentByAuthor,
    createComment,
    updateComment,
    deleteComment,
    moderateComment,
};
