import { CommentStatus, Post, PostStatus } from "../../generated/prisma/client";
import { PostWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllPost = async ({
    search,
    tags,
    isFeatured,
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
    isFeatured: boolean | undefined;
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

    if (typeof isFeatured === "boolean") {
        andConditions.push({
            isFeatured,
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
        include: {
            _count: {
                select: { comments: true },
            },
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
            include: {
                comments: {
                    where: {
                        parentId: null,
                        status: CommentStatus.APPROVED,
                    },
                    orderBy: { createdAt: "desc" },
                    include: {
                        replies: {
                            where: {
                                status: CommentStatus.APPROVED,
                            },
                            orderBy: { createdAt: "asc" },
                            include: {
                                replies: {
                                    where: {
                                        status: CommentStatus.APPROVED,
                                    },
                                    orderBy: { createdAt: "asc" },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: { comments: true },
                },
            },
        });

        return postData;
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

const getMyPosts = async (authorId: string) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
            status: "ACTIVE",
        },
        select: {
            id: true,
            status: true,
        },
    });

    // console.log({authorId})
    const result = await prisma.post.findMany({
        where: {
            authorId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: {
                    comments: true,
                },
            },
        },
    });

    // const total = await prisma.post.aggregate({
    //     _count: {
    //         id: true
    //     },
    //     where: {
    //         authorId
    //     }
    // })

    return result;
};

// user - shudhu nijer post update korte parbe. isFeatured field update korte parbee na
// admin - sobar post e update korte parbe.

const updatePost = async (postId: string, data: Partial<Post>, authorId: string, isAdmin: boolean) => {
    // console.log({ postId, data, authorId });

    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
        },
        select: {
            id: true,
            authorId: true,
        },
    });

    if (!isAdmin && postData.authorId !== authorId) {
        throw new Error("You are not the owner/creator of this post");
    }

    if (!isAdmin) {
        delete data.isFeatured;
        throw new Error(`An User Can't Update isFeatured field!`);
    }

    const result = await prisma.post.update({
        where: {
            id: postData.id,
        },
        data,
    });

    return result;
};

// 1. user - nijer post delete korte parbe
// 2. admin - sobar post e delete korte parbe
const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    console.log({ postId, authorId });

    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
        },
        select: {
            id: true,
            authorId: true,
        },
    });

    if (!isAdmin && postData.authorId !== authorId) {
        throw new Error("You are not the owner / creator of this post!");
    }

    return await prisma.post.delete({
        where: {
            id: postId,
        },
    });
};

const getStats = async () => {
    console.log("get stats");

    // postCount, published post, draft posts, total comments, total views
    return await prisma.$transaction(async (tx) => {
        const [totalPosts, publishePosts, draftPosts, archivedPosts, totalComments, approvedComments, rejctComments, adminCount, userCount, totalUser, totalViews] =
            await Promise.all([
                await tx.post.count(),
                await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
                await tx.post.count({ where: { status: PostStatus.DRAFT } }),
                await tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
                await tx.comment.count(),
                await tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
                await tx.comment.count({ where: { status: CommentStatus.REJECT } }),
                await tx.user.count({where: {role: "ADMIN"}}),
                await tx.user.count({where: {role: "USER"}}),
                await tx.user.count(),
                await tx.post.aggregate({_sum:{views: true}})
            ]);

        return {
            totalPosts,
            publishePosts,
            draftPosts,
            archivedPosts,
            totalComments,
            approvedComments,
            rejctComments,
            adminCount, 
            userCount,
            totalUser,
            totalViews:totalViews._sum.views,
        };
    });
};

export const postService = {
    createPost,
    getAllPost,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getStats,
};
