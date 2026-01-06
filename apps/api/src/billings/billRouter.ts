import { procedure, router } from '../trpc/index.js';
import { billService } from './billService.js';
import {
  billIdSchema,
  billInputSchema,
  billUpdateSchema,
  billUpdateStatusSchema,
  closeMonthSchema,
} from './billValidator.js';

export const billRouter = router({
  newBill: procedure.input(billInputSchema).mutation(async ({ input, ctx }) => {
    return billService.createBill(input, ctx.user.id);
  }),

  allBills: procedure.query(async ({ ctx }) => {
    return billService.getAllActiveBills(ctx.user.id);
  }),

  updateBill: procedure.input(billUpdateSchema).mutation(async ({ input, ctx }) => {
    return billService.updateBill(input, ctx.user.id);
  }),

  deleteBill: procedure.input(billIdSchema).mutation(async ({ input, ctx }) => {
    return billService.deleteBill(input.id, ctx.user.id);
  }),

  updateStatus: procedure.input(billUpdateStatusSchema).mutation(async ({ input, ctx }) => {
    return billService.updateStatus(input, ctx.user.id);
  }),

  closeMonth: procedure.input(closeMonthSchema).mutation(async ({ input, ctx }) => {
    return billService.closeMonth(input, ctx.user.id);
  }),
});
