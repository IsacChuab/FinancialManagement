import mongoose, { type Document, Schema } from 'mongoose';
import type { IUser } from '@financial/shared';

export interface IUserModel extends Document, Omit<IUser, 'id'> {}

const UserSchema = new Schema<IUserModel>(
  {
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
    code: { type: String },
    expiresAt: { type: Date },
  },
  {
    collection: 'users',
    toJSON: {
      transform(_, ret: any) {
        ret.id = ret._id;

        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
    toObject: {
      transform(_, ret: any) {
        ret.id = ret._id;
        ret.createdAt = ret.createdAt.toISOString();
        ret.updatedAt = ret.updatedAt.toISOString();
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

export const User = mongoose.model<IUserModel>('users', UserSchema);
