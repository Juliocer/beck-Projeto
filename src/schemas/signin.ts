import { z } from "zod";

export const signinSchema = z.object({
    email: z.string({ message: "E-mail é obrigatório" }).email('E-mail invalido'),
    password: z.string({ message: "Senha e obrigatório" }).min(4, 'Precisa ter mais de 4 caracteres')
});

