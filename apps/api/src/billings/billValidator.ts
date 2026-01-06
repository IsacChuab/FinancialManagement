import { z } from 'zod';

const billStatusEnum = z.enum(['paid', 'pending', 'late']);

export const billIdSchema = z.object({
  id: z.string(),
});

const baseInputs = {
  name: z.string().min(3),
  amount: z.number().min(0.01),
  status: billStatusEnum,
};

const debitSchema = z.object({
  type: z.literal('debit'),
  ...baseInputs,
});

const creditSchema = z.object({
  type: z.literal('credit'),
  valueInstallment: z.number().min(0.01),
  dueDate: z.date(),
  currentInstallment: z.number().min(1),
  totalInstallments: z.number().min(1),
  ...baseInputs,
});

const vitalSchema = z.object({
  type: z.literal('vital'),
  dueDate: z.date(),
  ...baseInputs,
});

export const billInputSchema = z.discriminatedUnion('type', [
  debitSchema,
  creditSchema,
  vitalSchema,
]);

export const billUpdateSchema = billInputSchema.and(billIdSchema);
export type BillUpdate = z.infer<typeof billUpdateSchema>;

export type BillInput = z.infer<typeof billInputSchema>;

export const billUpdateStatusSchema = z.object({
  id: z.string(),
  status: billStatusEnum,
});

export type BillUpdateStatus = z.infer<typeof billUpdateStatusSchema>;

export const closeMonthSchema = z.array(billUpdateSchema).min(1);
