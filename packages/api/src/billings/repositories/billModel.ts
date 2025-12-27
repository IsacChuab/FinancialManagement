import mongoose, { type Document, Schema } from 'mongoose';

export interface Bill {
  id: string;
  amount: number;
  currentInstallment: number;
  dueDate: Date;
  name: string;
  totalInstallments: number;
  type: string;
  valueInstallment: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isActive: boolean;
}

export interface BillModel extends Document, Omit<Bill, 'id'> {}

const BillSchema = new Schema<BillModel>(
  {
    amount: { type: Number, required: true },
    currentInstallment: { type: Number },
    dueDate: { type: Date, index: 1 },
    name: { type: String, required: true },
    totalInstallments: { type: Number },
    type: { type: String, required: true, index: 1 },
    valueInstallment: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
    isActive: { type: Boolean, default: true, index: 1 },
  },
  {
    collection: 'bills',
    toJSON: {
      transform(_, ret: any) {
        ret.id = ret._id;

        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform(_, ret: any) {
        ret.id = ret._id;
        ret.createdAt = ret.createdAt.toISOString();
        ret.updatedAt = ret.updatedAt.toISOString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

BillSchema.index({ isActive: 1, type: 1 });

export const Bill = mongoose.model<BillModel>('bills', BillSchema);
