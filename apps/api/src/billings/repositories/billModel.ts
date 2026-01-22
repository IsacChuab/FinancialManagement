import mongoose, { type Document, Schema } from 'mongoose';

interface IBill {
  id: string;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currentInstallment: number;
  dueDate: Date;
  name: string;
  totalInstallments: number;
  type: 'debit' | 'credit' | 'vital';
  valueInstallment: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isActive: boolean;
  order: number;
  status: 'paid' | 'pending' | 'late';
}

export interface BillModel extends Document<mongoose.Types.ObjectId>, Omit<IBill, 'id'> {}

const BillSchema = new Schema<BillModel>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currentInstallment: { type: Number },
    dueDate: { type: Date, index: 1 },
    name: { type: String, required: true },
    totalInstallments: { type: Number },
    type: { type: String, enum: ['debit', 'credit', 'vital'], required: true, index: 1 },
    valueInstallment: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
    isActive: { type: Boolean, default: true, index: 1 },
    order: { type: Number },
    status: { type: String, enum: ['paid', 'pending', 'late'], required: true },
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
