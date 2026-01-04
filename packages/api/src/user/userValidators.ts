import { z } from 'zod';

export const loginValidator = z.object({
  email: z.email(),
  password: z.string().min(3).max(10),
});

export type LoginInput = z.infer<typeof loginValidator>;

export const newPassword = {
  newPassword: z.string().min(3).max(10),
  confirmNewPassword: z.string().min(3).max(10),
};

export const changePasswordValidator = z.object({
  currentPassword: z.string().min(3).max(10),
  ...newPassword,
});

export type ChangePasswordInput = z.infer<typeof changePasswordValidator>;

export const createUserValidator = z.object({
  email: z.email(),
  ...newPassword,
});

export type CreateUserInput = z.infer<typeof createUserValidator>;

export const forgotPasswordValidator = z.object({
  email: z.email(),
  code: z.number().min(6).max(6),
  ...newPassword,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordValidator>;
