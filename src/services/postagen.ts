import slug from "slug";
import { prisma } from "../utils/prisma"
import { getPublicURL } from "../utils/url";

export const findPostagen = async(id: number) => {
    const postagen = await prisma.postagens.findFirst({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            postagensLike: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { id }
    });

    if(postagen){
        postagen.user.avatar = getPublicURL(postagen.user.avatar);
        return postagen;
    }

    return null;
}

export const createPostagen = async(slug: string, body: string, answer?: number) => {
    const newPostagen = await prisma.postagens.create({
        data: {
            body,
            userSlug: slug,
            answerOf: answer ?? 0
        }
    });
    return newPostagen;
}

export const findAnswersFromPostagen = async(id: number) => {
    const postagen = await prisma.postagens.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            postagensLike: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { answerOf: id }
    });

    for(let postagenIndex in postagen){
        postagen[postagenIndex].user.avatar = getPublicURL(postagen[postagenIndex].user.avatar);
    }

    return postagen;
}

export const checkIfPosatagenIsLikedByUser = async(slug: string, id: number) => {
    const isLiked = await prisma.postagensLike.findFirst({
        where: {
            userSlug: slug,
            postagenId: id
        }
    });

    return isLiked ? true : false;

}


export const unlikePostagen = async(slug: string, id: number) => {
    await prisma.postagensLike.deleteMany({
        where: {
            userSlug: slug,
            postagenId: id
        }
    })
} 

export const likePostagen = async (slug: string, id: number) => {
    await prisma.postagensLike.create({
        data: {
            userSlug: slug,
            postagenId: id
        }
    });
}

export const findPostagensByUser = async (slug: string, currentPage: number, perPage: number) => {
    const postagen = await prisma.postagens.findMany({
        include: {
            postagensLike: {
                select: {
                    userSlug: true
                }
            }  
        },
        where: { userSlug: slug, answerOf: 0 },
        orderBy: { createdAt: 'desc' },
        skip: currentPage * perPage,
        take: perPage
    });

    return postagen;
}

export const findPostagenFeed = async (following: string[], currentPage: number, perPage: number) => {
    const postagens = await prisma.postagens.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            postagensLike: {
                select: {
                    userSlug: true
                }
            }
        },
        where: {
            userSlug: { in: following },
            answerOf: 0
        },
        orderBy: { createdAt: 'desc' },
        skip: currentPage * perPage,
        take: perPage
    });

    for(let postagenIndex in postagens) {
        postagens[postagenIndex].user.avatar = getPublicURL(postagens[postagenIndex].user.avatar);
    }

    return postagens;
}

export const findPostagenByBody = async (bodyContains: string, currentPage: number, perPage: number) => {
    const postagens = await prisma.postagens.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            postagensLike: {
                select: {
                    userSlug: true
                }
            }
        },
        where: {
            body: {
                contains: bodyContains,
                mode: 'insensitive'
            },
            answerOf: 0
        },
        orderBy: { createdAt: 'desc' },
        skip: currentPage * perPage,
        take: perPage

    });

    for(let postagenIndex in postagens) {
        postagens[postagenIndex].user.avatar = getPublicURL(postagens[postagenIndex].user.avatar);
    }

    return postagens;
}