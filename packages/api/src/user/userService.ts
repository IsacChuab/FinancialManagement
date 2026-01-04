import { User } from './repositories/userModel.js';
import { userRepository } from './repositories/userRepository.js';
import { ChangePasswordInput, CreateUserInput, LoginInput } from './userValidators.js';
import crypto from 'node:crypto';
import { generateToken } from '../utils/token.js';

class UserService {
  public async createUser({ email, newPassword }: CreateUserInput) {
    const user = await userRepository.findByEmail(email);

    if (user) {
      throw new Error('User already exists');
    }

    const hashPass = crypto.createHash('sha256').update(newPassword).digest('hex');

    const userObject = new User({
      email,
      password: hashPass,
    });

    const savedUser = await userRepository.save(userObject);

    const token = generateToken(savedUser.id, savedUser.email);

    return { user: { id: savedUser.id, email: savedUser.email }, token };
  }

  public async login({ email, password }: LoginInput) {
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

  public async changePassword(email: string, input: ChangePasswordInput) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const hashCurrentPass = crypto.createHash('sha256').update(input.currentPassword).digest('hex');

    if (user.password !== hashCurrentPass) {
      throw new Error('Invalid password');
    }

    const hashNewPass = crypto.createHash('sha256').update(input.newPassword).digest('hex');
    user.password = hashNewPass;

    await userRepository.save(user);

    const token = generateToken(user.id, user.email);

    return { user: { id: user.id, email: user.email }, token };
  }
}

export const userService = new UserService();
