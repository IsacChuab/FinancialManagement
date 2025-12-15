import { User } from './repositories/userModel.js';
import { userRepository } from './repositories/userRepository.js';
import { UserInput } from './userValidators.js';
import crypto from 'node:crypto';
import { generateToken } from '../utils/token.js';

class UserService {
  public async createUser({ email, password }: UserInput) {
    const hashPass = crypto.createHash('sha256').update(password).digest('hex');

    const userObject = new User({
      email,
      password: hashPass,
    });

    await userRepository.save(userObject);

    return { message: 'User created successfully', user: userObject.email };
  }

  public async login({ email, password }: UserInput) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const hashPass = crypto.createHash('sha256').update(password).digest('hex');

    if (user.password !== hashPass) {
      throw new Error('Invalid password');
    }

    const token = generateToken(user.id, user.email);

    return { user: { id: user.id, email: user.email }, token };
  }

  public async findById(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const token = generateToken(user.id, user.email);

    return { user: { id: user.id, email: user.email }, token };
  }
}

export const userService = new UserService();
