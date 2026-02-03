import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '../.env', override: true });

export const PORT = Number(process.env.PORT || 3000);
export const VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:5173';

export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:test';

export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_not_set';

export const RESEND_API_KEY = process.env.RESEND_API_KEY || 'key_not_set';
export const MAIL_FROM = process.env.MAIL_FROM || 'suporte financial app';