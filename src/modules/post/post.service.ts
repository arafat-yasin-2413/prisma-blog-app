import { Post, PostStatus } from "../../generated/prisma/client";
import { PostWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllPost = async ({
    search,
    tags,
    isFeatures,
    status,
    authorId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
}: {
    search: string | undefined;
    tags: string[] | [];
    isFeatures: boolean | undefined;
    status: PostStatus | undefined;
    authorId: string | undefined;
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}) => {
    const andConditions: PostWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },

                {
                    content: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
                {
                    tags: {
                        has: search as string,
                    },
                },
            ],
        });
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags as string[],
            },
        });
    }

    if (typeof isFeatures === "boolean") {
        andConditions.push({
            isFeatures,
        });
    }

    if (status) {
        andConditions.push({
            status,
        });
    }

    if (authorId) {
        andConditions.push({
            authorId,
        });
    }

    const allPost = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions,
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.post.count({
        where: {
            AND: andConditions,
        },
    });

    return {
        data: allPost,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getPostById = async (postId: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId,
            },
            data: {
                views: {
                    increment: 1,
                },
            },
        });

        // console.log("get post by id", postId);
        const postData = await tx.post.findUnique({
            where: {
                id: postId,
            },
        });

        return postData
    });

};

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId,
        },
    });
    return result;
};

export const postService = {
    createPost,
    getAllPost,
    getPostById,
};
