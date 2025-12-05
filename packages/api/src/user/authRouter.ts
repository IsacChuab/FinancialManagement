import { publicProcedure, router } from '../trpc/index.js';
import { userService } from './userService.js';
import { userValidator } from './userValidators.js';

export const authRouter = router({
  login: publicProcedure.input(userValidator).query(async ({ input }) => {
    return userService.login(input);
  }),
});
