import { addActionsToBill } from '../utils/actionsBill.js';
import { BillWithActions } from './billTypes.js';
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

    const formattedBill = addActionsToBill(billObject);

    return formattedBill;
  }

  public async getAllActiveBills(userId: string) {
    const data = await billRepository.findActives(userId);

    const formattedData = data.map(addActionsToBill);

    return formattedData;
  }
}

export const billService = new BillService();
