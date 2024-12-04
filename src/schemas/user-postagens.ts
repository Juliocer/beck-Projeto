import { z } from "zod";

export const userPostagensSchema = z.object({
    page: z.coerce.number().min(0).optional()
});