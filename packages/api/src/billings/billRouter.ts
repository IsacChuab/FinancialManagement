import { procedure, router } from '../trpc/index.js';
import { billService } from './billService.js';
import { billDeleteSchema, billInputSchema, billUpdateStatusSchema } from './billValidator.js';

export const billRouter = router({
  newBill: procedure.input(billInputSchema).mutation(async ({ input, ctx }) => {
    return billService.createBill(input, ctx.user.id);
  }),

  allBills: procedure.query(async ({ ctx }) => {
    return billService.getAllActiveBills(ctx.user.id);
  }),

  // updateBill: procedure.input(billInputSchema).mutation(async ({ input, ctx }) => {
  //   return billService.updateBill(input, ctx.user.id);
  // }),

  deleteBill: procedure.input(billDeleteSchema).mutation(async ({ input, ctx }) => {
    return billService.deleteBill(input.id, ctx.user.id);
  }),

  updateStatus: procedure.input(billUpdateStatusSchema).mutation(async ({ input, ctx }) => {
    return billService.updateStatus(input, ctx.user.id);
  }),
});
