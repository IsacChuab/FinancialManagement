import { billRouter } from '../billings/billRouter.js';
import { authRouter } from '../user/authRouter.js';
import { router } from './index.js';

export const trpcRouter = router({
  auth: authRouter,
  bill: billRouter,
});

export type TrpcRouter = typeof trpcRouter;
