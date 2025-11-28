import { IUserModel } from './userModel.js';

class UserRepository {
  public async save(user: IUserModel) {
    if (user.isNew || user.isModified()) {
      await user.save();
    }
    return user;
  }
}

export const userRepository = new UserRepository();
