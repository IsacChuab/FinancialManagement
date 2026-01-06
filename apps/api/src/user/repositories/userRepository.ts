import { IUserModel, User } from './userModel.js';

class UserRepository {
  public async save(user: IUserModel) {
    if (user.isNew || user.isModified()) {
      await user.save();
    }

    return user;
  }

  public async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  public async validatePasswordResetCode(email: string, code: string) {
    return await User.findOne({ email, code, expiresAt: { $gt: new Date() } });
  }
}

export const userRepository = new UserRepository();
