import dotenv from 'dotenv';

dotenv.config();

export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:test';

export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_not_set';

export const RESEND_API_KEY = process.env.RESEND_API_KEY || 'key_not_set';
export const MAIL_FROM = process.env.MAIL_FROM || 'suporte financial app';