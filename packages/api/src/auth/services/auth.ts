import * as jwt from 'jsonwebtoken';

class AuthService {
  public validateToken(token: string) {
    const validData: any = jwt.verify(token, 'deafult-secret');

    return { id: validData.id, email: validData.email };
  }
}

export const authService = new AuthService();
