import { z } from "zod";

export const signupSchema = z.object({
    name: z.string({ message: "Nome é obrigatório" }).min(2, 'Precissa ter 2 ou mais caracteres'),
    email: z.string({ message: "E-mail é obrigatório" }).email('E-mail invalido'),
    password: z.string({ message: "Senha e obrigatório" }).min(4, 'Precisa ter mais de 4 caracteres')
});