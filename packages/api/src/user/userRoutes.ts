import { trpc } from '../trpcRouter.js';
import { userService } from './userService.js';
import { userValidator } from './userValidators.js';

export const userRouter = trpc.router({
  newUser: trpc.procedure.input(userValidator).mutation(({ input }) => {
    return userService.createUser(input);
  }),
});
