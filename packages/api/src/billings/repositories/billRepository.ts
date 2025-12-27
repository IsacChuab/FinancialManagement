import { BillModel, Bill } from './billModel.js';

class BillRepository {
  public async save(bill: BillModel) {
    if (bill.isNew || bill.isModified()) {
      await bill.save();
    }
    return bill;
  }

  public async findActives() {
    return await Bill.find({ isActive: true });
  }
}

export const billRepository = new BillRepository();
