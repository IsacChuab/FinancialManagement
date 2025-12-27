import { BillInput } from './billValidator.js';
import { Bill } from './repositories/billModel.js';
import { billRepository } from './repositories/billRepository.js';

class BillService {
  public async createBill(input: BillInput, userId: string) {
    const billObject = new Bill({
      ...input,
      userId: userId,
      isActive: true,
    });

    await billRepository.save(billObject);

    return billObject;
  }

  public async getAllActiveBills(userId: string) {
    return await billRepository.findActives(userId);
  }
}

export const billService = new BillService();
