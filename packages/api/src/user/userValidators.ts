import { z } from 'zod';

export const userValidator = z.object({
  email: z.email(),
  password: z.string().min(3).max(10),
});

export type UserInput = z.infer<typeof userValidator>;
