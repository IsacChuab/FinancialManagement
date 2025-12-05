import { initTRPC } from '@trpc/server';
import { Context } from './context.js';
import superJSON from 'superjson';
import { authMiddleware } from '../middlewares/auth.js';

const trpc = initTRPC.context<Context>().create({
  transformer: superJSON,
});

const errorMiddleware = trpc.middleware(async ({ next }) => {
  const result = await next();

  if ('error' in result && result.error) {
    console.trace(result.error);
  }

  return result;
});

export const router = trpc.router;
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure.use(errorMiddleware);
export const procedure = trpc.procedure.use(authMiddleware()).use(errorMiddleware);
