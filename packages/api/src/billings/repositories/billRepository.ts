import mongoose from 'mongoose';
import { BillModel, Bill } from './billModel.js';

class BillRepository {
  public async save(bill: BillModel) {
    if (bill.isNew || bill.isModified()) {
      await bill.save();
    }

    return bill;
  }

  public async findActives(userId: string) {
    return await Bill.find({ isActive: true, userId }).sort({ type: 1 });
  }

  public async findById(id: string): Promise<BillModel | null> {
    return await Bill.findById(id);
  }

  public async delete(id: string) {
    await Bill.findByIdAndDelete(id);
  }

  public async replace(id: mongoose.Types.ObjectId, data: Partial<BillModel>) {
    const bill = await Bill.findOneAndReplace(
      {
        _id: id,
      },
      data,
      { new: true },
    );

    return bill;
  }
}

export const billRepository = new BillRepository();
