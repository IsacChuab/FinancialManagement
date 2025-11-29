import { User } from './repositories/userModel.js';
import { userRepository } from './repositories/userRepository.js';
import { UserInput } from './userValidators.js';
import crypto from 'node:crypto';

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
    console.log('cheguei aqui');
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const hashPass = crypto.createHash('sha256').update(password).digest('hex');

    if (user.password !== hashPass) {
      throw new Error('Invalid password');
    }

    console.log('loguei');
    return { message: 'User logged in successfully', user: user.email };
  }
}

export const userService = new UserService();
