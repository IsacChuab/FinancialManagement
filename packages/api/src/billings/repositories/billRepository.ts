import { BillModel, Bill } from './billModel.js';

class BillRepository {
  public async save(bill: BillModel) {
    if (bill.isNew || bill.isModified()) {
      await bill.save();
    }

    return bill;
  }

  public async findActives(userId: string) {
    return await Bill.find({ isActive: true, userId }).sort({ type: 1 }).lean();
  }
}

export const billRepository = new BillRepository();
