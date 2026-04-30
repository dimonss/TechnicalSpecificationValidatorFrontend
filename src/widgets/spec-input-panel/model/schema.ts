import { z } from 'zod';

export const specInputSchema = z.object({
  text: z
    .string()
    .trim()
    .min(20, 'Минимальная длина — 20 символов')
    .max(50_000, 'Максимальная длина — 50 000 символов'),
});

export type SpecInputValues = z.infer<typeof specInputSchema>;
