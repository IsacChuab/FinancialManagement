import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc/index.js';
import { validateToken } from '../utils/token.js';

export const authMiddleware = () =>
  middleware(({ ctx, next }) => {
    if (!ctx.token) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be authenticated' });
    }

    try {
      const { id, email } = validateToken(ctx.token);

      return next({
        ctx: {
          user: { id, email },
        },
      });
    } catch (error) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
    }
  });
