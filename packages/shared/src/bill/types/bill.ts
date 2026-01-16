export type BillAction = 'checkPaid' | 'checkPending' | 'edit' | 'delete';
export type BillStatus = 'paid' | 'pending' | 'late';
export type BillType = 'debit' | 'credit' | 'vital';
export interface IBill {
  id: string;
  userId: string;
  amount: number;
  currentInstallment: number;
  dueDate: string | null;
  name: string;
  totalInstallments: number;
  type: BillType;
  valueInstallment: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  isActive: boolean;
  status: BillStatus;
}

export type BillWithActions = IBill & {
  actions: BillAction[];
};
