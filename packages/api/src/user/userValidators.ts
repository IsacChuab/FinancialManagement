import { z } from 'zod';

export const userValidator = z.object({
  email: z.email(),
  password: z.string().min(3).max(10),
});

export type UserInput = z.infer<typeof userValidator>;

export const changePasswordValidator = z.object({
  currentPassword: z.string().min(3).max(10),
  newPassword: z.string().min(3).max(10),
  confirmNewPassword: z.string().min(3).max(10),
});

export type ChangePasswordInput = z.infer<typeof changePasswordValidator>;
