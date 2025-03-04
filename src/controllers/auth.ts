import { RequestHandler } from "express";
import { signupSchema } from "../schemas/signup";
import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";
import { compare, hash, hashSync } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { signinSchema } from "../schemas/signin";

export const signup: RequestHandler = async (req, res) => {
    // validar os dados recebidos 
    const safeData = signupSchema.safeParse(req.body);
    if(!safeData.success){
        res.status(400).json({error: safeData.error.flatten().fieldErrors });
        return;
    }

    // verificar email
    const hasEmail = await findUserByEmail(safeData.data.email);
    if(hasEmail){
        res.status(400).json({ error: 'E-mail já existe' })
        return;
    }

    // verificar slug
    let genSlug = true;
    let userSlug = slug(safeData.data.name);
    while(genSlug) {
        const hasSlug = await findUserBySlug(userSlug);
        if(hasSlug) {
            let slugSuffix = Math.floor(Math.random() * 999999).toString();
            userSlug = slug(safeData.data.name + slugSuffix);
        } else {
            genSlug = false;
        }
    }

    // gerar hash de senha 
    const hashPassword = await hash(safeData.data.password, 10);

    // cria o usuario 
    const newUser = await createUser({
        slug: userSlug,
        name: safeData.data.name,
        email: safeData.data.email,
        password: hashPassword
    });

    // cria o token 
    const token = createJWT(userSlug);

    // retorna o resultado ( token, user )
    res.status(201).json({
        token,
        user: {
            name: newUser.name,
            slug: newUser.slug,
            avatar: newUser.avatar
        }
    });

    console.log('chego aqui ')

}

export const signin: RequestHandler = async (req, res) => {
    // validar os dados recebidos 
    const safeData = signinSchema.safeParse(req.body);
    if(!safeData.success){
        res.status(400).json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    const user = await findUserByEmail(safeData.data.email);
    if(!user) { 
        console.log('Usuário não encontrado');
        res.status(401).json({ error: 'Acesso negado' });
        return;
    }

    const verifyPass = await compare(safeData.data.password, user.password);
    if(!verifyPass) {
        res.status(401).json({ error: 'Acesso negado' });
        return;
    }

    const token = createJWT(user.slug);

    // retorna o resultado ( token, user )
    console.log('Autenticação bem-sucedida');
    res.json({
        token,
        user: {
            name: user.name,
            slug: user.slug,
            avatar: user.avatar
        }
    });
}

