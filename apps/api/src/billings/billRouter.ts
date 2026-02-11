import { procedure, router } from '../trpc/index.js';
import { billService } from './billService.js';
import {
  billIdSchema,
  billInputSchema,
  billSummarySchema,
  billUpdateSchema,
  billUpdateStatusSchema,
  updateInBulk,
} from '@isac-chuab/financial-shared';

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

  closeMonth: procedure.input(updateInBulk).mutation(async ({ input, ctx }) => {
    return billService.closeMonth(input, ctx.user.id);
  }),

  updateBillsInBulk: procedure.input(updateInBulk).mutation(async ({ input }) => {
    return billService.updateBillsInBulk(input);
  }),

  summary: procedure.output(billSummarySchema).query(async ({ ctx }) => {
    return billService.getSummary(ctx.user.id);
  }),
});
