import { trpc } from '../trpcRouter.js';
import { userRouter } from '../user/userRoutes.js';

export const appRouter = trpc.router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
