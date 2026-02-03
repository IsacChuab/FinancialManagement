import { User } from './repositories/userModel.js';
import { userRepository } from './repositories/userRepository.js';
import type { ChangePasswordInput, CreateUserInput, LoginInput } from '@financial/shared';
import crypto from 'node:crypto';
import { generateToken } from '../utils/token.js';
import EmailSender from '../lib/EmailSender.js';

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

    return {
      success: true,
      message: 'Usuário criado com sucesso',
      user: { id: savedUser.id, email: savedUser.email },
      token,
    };
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

    return {
      success: true,
      message: 'Senha alterada com sucesso',
      user: { id: user.id, email: user.email },
      token,
    };
  }

  public async firstStepForgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return { success: true, message: 'E-mail de recuperação enviado' };
    }

    if (user.code && user.expiresAt && user.expiresAt > new Date()) {
      await EmailSender.sendRecoveryEmail({ to: email, code: user.code });
      return { success: true, message: 'E-mail de recuperação enviado' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.code = code;
    user.expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await userRepository.save(user);

    await EmailSender.sendRecoveryEmail({ to: email, code });

    return { success: true, message: 'E-mail de recuperação enviado' };
  }

  public async secondStepForgotPassword(email: string, code: string) {
    const user = await userRepository.validatePasswordResetCode(email, code);

    if (!user) {
      throw new Error('Código inválido ou expirado');
    }

    return { success: true };
  }

  public async thirdStepForgotPassword(email: string, newPassword: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    const hashNewPass = crypto.createHash('sha256').update(newPassword).digest('hex');
    user.password = hashNewPass;
    user.code = undefined;
    user.expiresAt = undefined;

    await userRepository.save(user);

    return { success: true, message: 'Senha atualizada com sucesso' };
  }
}

export const userService = new UserService();
