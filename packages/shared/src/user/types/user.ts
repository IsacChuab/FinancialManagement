export interface IUser {
  id: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  code?: string;
  expiresAt?: Date;
}
