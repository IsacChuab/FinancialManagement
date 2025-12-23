import { z } from 'zod';

const debitSchema = z.object({
  name: z.string().min(3),
  amount: z.number().min(0.01),
});

const creditSchema = debitSchema.extend({
  valueInstallment: z.number().min(0.01),
  dueDate: z.date(),
  currentInstallment: z.number().min(1),
  totalInstallments: z.number().min(1),
});

const vitalSchema = debitSchema.extend({
  dueDate: z.date(),
});

export type BillInput = z.infer<typeof debitSchema | typeof creditSchema | typeof vitalSchema>;
