import { addActionsToBill } from '../utils/actionsBill.js';
import type { BillInput, BillUpdate, BillUpdateStatus } from '@isac-chuab/financial-shared';
import { Bill, type BillModel } from './repositories/billModel.js';
import { billRepository } from './repositories/billRepository.js';
import dayjs from 'dayjs';
import { generateOrderBill } from '../utils/order.js';

class BillService {
  public async createBill(input: BillInput, userId: string) {
    const data = await billRepository.getLastOrder(userId);

    const order = generateOrderBill(data);

    const billObject = new Bill({
      ...input,
      userId: userId,
      order,
      isActive: true,
    });

    await billRepository.save(billObject);

    const formattedBill = addActionsToBill(billObject);

    return { success: true, message: 'Conta criada com sucesso', formattedBill };
  }

  public async getAllActiveBills(userId: string) {
    const data = await billRepository.findActives(userId);

    const formattedData = data.map(addActionsToBill);

    return formattedData;
  }

  public async updateBill(input: BillUpdate, userId: string) {
    const billObject = await billRepository.findById(input.id);

    if (!billObject) {
      throw new Error('Bill not found');
    }

    if (billObject.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }

    const updateBill = {
      userId: billObject.userId,
      createdAt: billObject.createdAt,
      updatedAt: new Date(),
      isActive: true,
      ...input,
    };

    const savedBill = await billRepository.replace(billObject._id, updateBill);

    const formattedBill = addActionsToBill(savedBill!);

    return { success: true, message: 'Conta atualizada com sucesso', formattedBill };
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

    const formattedBill = addActionsToBill(savedBill);

    return { success: true, message: 'Status atualizado com sucesso', formattedBill };
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

    return { success: true, message: 'Conta excluída com sucesso', id };
  }

  public async closeMonth(data: BillUpdate[], userId: string) {
    const billIds = data.map((bill) => bill.id);
    const unauthorizedBills = await billRepository.findUnauthorizedBills(billIds, userId);

    if (unauthorizedBills.length > 0) {
      throw new Error('Unauthorized Action');
    }

    await Promise.all([
      this.closeDebitBills(data),
      this.closeVitalBills(data),
      this.closeCreditBills(data),
    ]);
  }

  public async updateBillsInBulk(data: BillUpdate[]) {
    const billIds = data.map((bill) => bill.id);
    const bills = await billRepository.findByIds(billIds);

    bills.forEach((bill) => {
      bill.order = data.find((item) => item.id === bill.id)?.order!;
    });

    await billRepository.bulkUpdate(bills);
    const updatedBills = await billRepository.findByIds(billIds);

    const formattedBill = updatedBills.map(addActionsToBill);
    return { success: true, formattedBill };
  }

  private async closeDebitBills(data: BillUpdate[]) {
    const debitIds = data.filter((bill) => bill.type === 'debit').map((bill) => bill.id);

    if (debitIds.length === 0) {
      return;
    }

    await billRepository.updateManyByIds(debitIds, { isActive: false });
  }

  private async closeCreditBills(data: BillUpdate[]) {
    const creditIds = data.filter((bill) => bill.type === 'credit').map((bill) => bill.id);

    if (creditIds.length === 0) {
      return;
    }

    const bills = await billRepository.findByIds(creditIds);
    const duplicateBill: BillModel[] = [];

    for (const bill of bills) {
      const nextInstallment = bill.currentInstallment + 1;
      const nextDueDate = dayjs(bill.dueDate).add(1, 'month').toDate();
      const existingBill = await billRepository.findNextMonthBill(nextDueDate, bill);

      if (existingBill && bill.status === 'paid') {
        bill.isActive = false;
        continue;
      }

      if (nextInstallment > bill.totalInstallments && bill.status === 'paid') {
        bill.isActive = false;
        bill.status = 'paid';
        continue;
      }

      if (bill.status === 'paid') {
        bill.status = 'pending';
        bill.currentInstallment = nextInstallment;
        bill.dueDate = nextDueDate;
        continue;
      }

      bill.status = 'late';

      if (!existingBill && nextInstallment <= bill.totalInstallments) {
        duplicateBill.push(new Bill({
          ...bill.toObject(),
          dueDate: nextDueDate,
          status: 'pending',
          currentInstallment: nextInstallment,
        }));
      }

    };
    
    await billRepository.bulkUpdate(bills);

    if (duplicateBill.length > 0) {
      await billRepository.bulkInsert(duplicateBill);
    }
  }

  private async closeVitalBills(data: BillUpdate[]) {
    const vitalIds = data.filter((bill) => bill.type === 'vital').map((bill) => bill.id);
    const currentDate = dayjs().toDate();

    if (vitalIds.length === 0) {
      return;
    }

    const vitalBills = await billRepository.findByIds(vitalIds);
    const duplicateBill: BillModel[] = [];

    for (const bill of vitalBills) {
      const nextDueDate = dayjs(bill.dueDate).add(1, 'month').toDate();
      const existingBill = await billRepository.findNextMonthBill(nextDueDate, bill);

      if (existingBill && bill.status === 'paid') {
        bill.isActive = false;
        continue;
      }

      if (nextDueDate > currentDate && bill.status === 'paid') {
        bill.status = 'pending';
        bill.dueDate = nextDueDate;
        continue;
      }

      bill.status = 'late';

      if (!existingBill) {
        duplicateBill.push(new Bill({
          ...bill.toObject(),
          dueDate: nextDueDate,
          status: 'pending',
        }));
      
      }
    }

    await billRepository.bulkUpdate(vitalBills);

    if (duplicateBill.length > 0) {
      await billRepository.bulkInsert(duplicateBill);
    }
  }
}

export const billService = new BillService();
