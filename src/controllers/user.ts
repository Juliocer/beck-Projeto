import { Response } from "express"
import { ExtendedRequest } from "../types/extended-request"
import { checkIFollows, findUserBySlug, follow, getUserFollowersCount, getUserFollowingCount, getUserPostagenCount, unfollow, updateUserInfo } from "../services/user";
import { userPostagensSchema } from "../schemas/user-postagens";
import { findPostagensByUser } from "../services/postagen";
import { updateUserSchema } from "../schemas/update-user";

export const getUser = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const user = await findUserBySlug(slug);
    if(!user) {
        res.status(404).json({ error: "Usuário inexistente" });
        return;
    }

    const followingCount = await getUserFollowingCount(user.slug);
    const followersCount = await getUserFollowersCount(user.slug);
    const postagenCount = await getUserPostagenCount(user.slug);

    res.json({ user, followingCount, followersCount, postagenCount });
}

export const getUserPostagens = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const safeData = userPostagensSchema.safeParse(req.query);
    if(!safeData.success){
        console.log(safeData.error);
        res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    let perPage = 10;
    let currentPage = safeData.data.page ?? 0;

    const postagens = await findPostagensByUser(
        slug,
        currentPage,
        perPage
    );

    res.json({ postagens, page: currentPage });
}

export const followToggle = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const me = req.userSlug as string;

    const hasUserToBeFollowed = await findUserBySlug(slug);
    if(!hasUserToBeFollowed){
        res.status(404).json({ error: 'Usuário inexistente' });
        return;
    }

    const follows = await checkIFollows(me, slug);
    if(!follows){
        await follow(me, slug);
        res.json({ following: true });
    } else {
        await unfollow(me, slug);
        res.json({ following: false });
    }

}

export const updateUser = async (req: ExtendedRequest, res: Response) => {
    const safeData = updateUserSchema.safeParse(req.body);
    if(!safeData.success){
        console.log(safeData.error); // Debug
        res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    await updateUserInfo(
        req.userSlug as string,
        safeData.data
    );

    res.json({});
}