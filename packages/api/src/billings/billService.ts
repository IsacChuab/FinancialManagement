import { BillInput } from './billValidator.js';
import { Bill } from './repositories/billModel.js';
import { billRepository } from './repositories/billRepository.js';

class BillService {
  public async createBill(input: BillInput) {
    const billObject = new Bill({
      ...input,
      isActive: true,
    });

    await billRepository.save(billObject);

    return { message: 'Bill created successfully', bill: billObject };
  }

  public async getAllActiveBills() {
    return await billRepository.findActives();
  }
}

export const billService = new BillService();
