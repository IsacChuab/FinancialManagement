import mongoose from 'mongoose';
import { BillModel, Bill, IBill } from './billModel.js';

class BillRepository {
  public async save(bill: BillModel) {
    if (bill.isNew || bill.isModified()) {
      await bill.save();
    }

    return bill;
  }

  public async updateManyByIds(ids: string[], data: Partial<BillModel>) {
    return Bill.updateMany({ _id: { $in: ids } }, { $set: data });
  }

  public async bulkUpdate(bills: BillModel[]) {
    const operations = bills.map((bill) => ({
      updateOne: {
        filter: { _id: bill._id },
        update: { $set: bill },
      },
    }));

    await Bill.bulkWrite(operations);
  }

  public async findActives(userId: string) {
    return await Bill.find({ isActive: true, userId }).sort({ type: 1 });
  }

  public async findById(id: string): Promise<BillModel | null> {
    return await Bill.findById(id);
  }

  public async findByIds(ids: string[]): Promise<BillModel[]> {
    return await Bill.find({ _id: { $in: ids } });
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

  public async findUnauthorizedBills(billIds: string[], userId: string) {
    return await Bill.find({
      _id: { $in: billIds },
      userId: { $ne: new mongoose.Types.ObjectId(userId) },
    }).select('_id');
  }
}

export const billRepository = new BillRepository();
