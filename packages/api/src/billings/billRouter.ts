import { procedure, router } from '../trpc/index.js';
import { billService } from './billService.js';
import { billInputSchema } from './billValidator.js';

export const billRouter = router({
  newBill: procedure.input(billInputSchema).mutation(async ({ input, ctx }) => {
    return billService.createBill(input, ctx.user.id);
  }),

  allBills: procedure.query(async ({ ctx }) => {
    return billService.getAllActiveBills(ctx.user.id);
  }),
});
