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

export const changePasswordValidator = z
  .object({
    currentPassword: z.string().min(3).max(10),
    ...newPassword,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordValidator>;

export const createUserValidator = z
  .object({
    email: z.email(),
    ...newPassword,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'],
  });

export type CreateUserInput = z.infer<typeof createUserValidator>;

const emailSchema = {
  email: z.email(),
};

const codeSchema = {
  code: z.string().regex(/^\d{6}$/, 'O código deve conter exatamente 6 dígitos'),
};

export const firstStepForgotPasswordValidator = z.object({
  ...emailSchema,
});

export const secondStepForgotPasswordValidator = z.object({
  ...emailSchema,
  ...codeSchema,
});

export const thirdStepForgotPasswordValidator = z
  .object({
    ...emailSchema,
    ...codeSchema,
    ...newPassword,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'],
  });

export type FirstStepForgotPasswordInput = z.infer<typeof firstStepForgotPasswordValidator>;
export type SecondStepForgotPasswordInput = z.infer<typeof secondStepForgotPasswordValidator>;
export type ThirdStepForgotPasswordInput = z.infer<typeof thirdStepForgotPasswordValidator>;
