import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { feedSchema } from "../schemas/feed";
import { getUserFollowing } from "../services/user";
import { findPostagenFeed } from "../services/postagen";

export const getFeed = async (req: ExtendedRequest, res: Response ) => {
    const safeData = feedSchema.safeParse(req.query);
    if(!safeData.success){
        console.log(safeData.error); // Debug
        res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    let perPage = 2;
    let currentPage = safeData.data.page ?? 0;

    const following = await getUserFollowing(req.userSlug as string);
    const postagens = await findPostagenFeed(following, currentPage, perPage);

    res.json({ postagens, page: currentPage });
}