import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc/index.js';
import { authService } from '../auth/services/auth.js';

export const authMiddleware = () =>
  middleware(({ ctx, next }) => {
    if (!ctx.token) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be authenticated' });
    }

    try {
      const { id, email } = authService.validateToken(ctx.token);

      return next({
        ctx: {
          user: { id, email },
        },
      });
    } catch (error) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
    }
  });
