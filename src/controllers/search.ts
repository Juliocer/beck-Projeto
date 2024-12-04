import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { searchSchema } from "../schemas/search";
import { findPostagenByBody } from "../services/postagen";

export const searchPostagens = async(req: ExtendedRequest, res: Response) => {
    const safeData = searchSchema.safeParse(req.query);
    if(!safeData.success){
        console.log(safeData.error); // Debug
        res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    let perPage = 2;
    let currentPage = safeData.data.page ?? 0;

    const postagens = await findPostagenByBody(
        safeData.data.q,
        currentPage,
        perPage
    );

    res.json({ postagens, page: currentPage });
}