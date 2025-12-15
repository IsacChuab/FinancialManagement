import jwt from 'jsonwebtoken';

export function validateToken(token: string) {
  try {
    const validData: any = jwt.verify(token, process.env.JWT_SECRET!);

    return { id: validData.id, email: validData.email };
  } catch (error) {
    console.error('Error validating token:', error);
    throw new Error('Invalid token');
  }
}

export function generateToken(id: string, email: string) {
  try {
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET!, {
      expiresIn: '1m',
    });

    return token;
  } catch (error) {
    throw new Error('Failed to generate token');
  }
}
