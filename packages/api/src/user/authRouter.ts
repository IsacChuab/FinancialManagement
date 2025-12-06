import { publicProcedure, router } from '../trpc/index.js';
import { userService } from './userService.js';
import { userValidator } from './userValidators.js';

export const authRouter = router({
  login: publicProcedure.input(userValidator).mutation(async ({ input }) => {
    return userService.login(input);
  }),
});
