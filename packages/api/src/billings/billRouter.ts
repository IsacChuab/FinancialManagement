import { procedure, router } from '../trpc/index.js';
import { billValidator } from './billValidator.js';

export const billRouter = router({
  newBill: procedure.input(billValidator).mutation(async ({ ctx }) => {}),
});
