import { authRouter } from '../user/authRouter.js';
import { router } from './index.js';

export const trpcRouter = router({
  auth: authRouter,
});

export type TrpcRouter = typeof trpcRouter;
