import { TRPCError } from '@trpc/server';
import { procedure, publicProcedure, router } from '../trpc/index.js';
import { userService } from './userService.js';
import { changePasswordValidator, createUserValidator, loginValidator } from './userValidators.js';

export const authRouter = router({
  login: publicProcedure.input(loginValidator).mutation(async ({ input, ctx }) => {
    const userLogged = await userService.login(input);

    ctx.res.cookie('token', userLogged.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return userLogged;
  }),

  createUser: publicProcedure.input(createUserValidator).mutation(async ({ input, ctx }) => {
    const userCreated = await userService.createUser(input);

    ctx.res.cookie('token', userCreated.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return userCreated;
  }),

  me: procedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return userService.findById(ctx.user.email);
  }),

  changePassword: procedure.input(changePasswordValidator).mutation(async ({ input, ctx }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return userService.changePassword(ctx.user.email, input);
  }),

  logout: procedure.mutation(async ({ ctx }) => {
    ctx.res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });
  }),
});
