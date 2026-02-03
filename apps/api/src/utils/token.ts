import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export function validateToken(token: string) {
  try {
    const validData: any = jwt.verify(token, JWT_SECRET);

    return { id: validData.id, email: validData.email };
  } catch (error) {
    console.error('Error validating token:', error);
    throw new Error('Invalid token');
  }
}

export function generateToken(id: string, email: string) {
  try {
    const token = jwt.sign({ id, email }, JWT_SECRET, {
      expiresIn: '1w',
    });

    return token;
  } catch (error) {
    throw new Error('Failed to generate token');
  }
}
