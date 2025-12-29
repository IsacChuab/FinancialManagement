import mongoose from 'mongoose';
import { addActionsToBill } from '../utils/actionsBill.js';
import { BillInput, BillUpdateStatus } from './billValidator.js';
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

  public async updateStatus(input: BillUpdateStatus, userId: string) {
    const billObject = await billRepository.findById(input.id);

    if (!billObject) {
      throw new Error('Bill not found');
    }

    if (billObject.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    billObject.status = input.status;
    const savedBill = await billRepository.save(billObject);

    return addActionsToBill(savedBill);
  }

  public async deleteBill(id: string, userId: string) {
    const billObject = await billRepository.findById(id);

    if (!billObject) {
      throw new Error('Bill not found');
    }

    if (billObject.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    if (!billObject.isActive) {
      return { id };
    }

    billObject.isActive = false;
    billObject.deletedAt = new Date();
    await billRepository.save(billObject);

    return { id };
  }
}

export const billService = new BillService();
