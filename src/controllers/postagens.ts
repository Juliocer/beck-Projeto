import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addPostagenSchema } from "../schemas/add-postagens";
import { checkIfPosatagenIsLikedByUser, createPostagen, findAnswersFromPostagen, findPostagen, likePostagen, unlikePostagen } from "../services/postagen";
import { addHashtag } from "../services/trend";

export const addPostagen = async (req: ExtendedRequest, res: Response) => {
    // validar os dados 
    const safeData = addPostagenSchema.safeParse(req.body);
    if(!safeData.success){
        res.status(400).json({error: safeData.error.flatten().fieldErrors });
        return;
    }

    // verificar se é resposta
    if(safeData.data.answer){
        const hasAnswerPostagen = await findPostagen(parseInt(safeData.data.answer));
        if(!hasAnswerPostagen) {
            res.json({ error: 'Postagen Original inexistente' });
            return;
        }
    } 

    // cria a postagen 
    const newPostagen = await createPostagen(
        req.userSlug as string,
        safeData.data.body,
        safeData.data.answer ? parseInt(safeData.data.answer) : 0
    );

    // adicionar a hashtag ao trend
    const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g);
    if(hashtags){
        for(let hashtag of hashtags){
            if(hashtag.length >= 2){
                await addHashtag(hashtag);
            }
        }
    }

    res.json({ postagen: newPostagen });
}

export const getPostagen = async(req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const postagen = await findPostagen(parseInt(id));
    if(!postagen){
        res.json({error: 'Postagem inexistente'});
    }
    res.json({ postagen }); 
}

export const getAnswers = async(req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const answer = await findAnswersFromPostagen(parseInt(id));

    res.json({ answer });
}

export const likeToggle = async (req: ExtendedRequest, res: Response) =>{
    const { id } = req.params;

    const liked = await checkIfPosatagenIsLikedByUser(
        req.userSlug as string,
        parseInt(id)
    );

    if(liked) {
        //unlike
        unlikePostagen(
            req.userSlug as string,
            parseInt(id)
        );
    }else {
        // like
        likePostagen(
            req.userSlug as string,
            parseInt(id)
        );
    }

    res.json({});
}