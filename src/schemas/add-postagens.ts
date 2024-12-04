import { z } from "zod";

export const addPostagenSchema = z.object({
    body: z.string({ message: 'Precisa enviar um corpo' }),
    answer: z.string().optional()
});