import { procedure, router } from '../trpc/index.js';
import { billService } from './billService.js';
import { billInputSchema } from './billValidator.js';

export const billRouter = router({
  newBill: procedure.input(billInputSchema).mutation(async ({ input }) => {
    return billService.createBill(input);
  }),

  allBills: procedure.query(async () => {
    return billService.getAllActiveBills();
  }),
});
