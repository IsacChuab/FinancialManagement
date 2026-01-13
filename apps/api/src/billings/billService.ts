import { addActionsToBill } from '../utils/actionsBill.js';
import { BillInput, BillUpdate, BillUpdateStatus } from './billValidator.js';
import { Bill } from './repositories/billModel.js';
import { billRepository } from './repositories/billRepository.js';
import dayjs from 'dayjs';

class BillService {
  public async createBill(input: BillInput, userId: string) {
    const billObject = new Bill({
      ...input,
      userId: userId,
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

  private async closeDebitBills(data: BillUpdate[]) {
    const debitIds = data.filter((bill) => bill.type === 'debit').map((bill) => bill.id);

    if (debitIds.length === 0) {
      return;
    }

    await billRepository.updateManyByIds(debitIds, { isActive: false });
  }

  private async closeCreditBills(data: BillUpdate[]) {
    const creditIds = data.filter((bill) => bill.type === 'credit').map((bill) => bill.id);
    const currentDate = dayjs().toDate();

    if (creditIds.length === 0) {
      return;
    }

    const bills = await billRepository.findByIds(creditIds);

    bills.forEach((bill) => {
      const nextInstallment = bill.currentInstallment + 1;
      const nextDueDate = dayjs(bill.dueDate).add(1, 'month').toDate();

      if (nextInstallment > bill.totalInstallments) {
        bill.isActive = false;
        return;
      }

      if (nextDueDate >= currentDate) {
        bill.status = 'pending';
      }

      bill.currentInstallment = nextInstallment;
      bill.dueDate = nextDueDate;
    });

    await billRepository.bulkUpdate(bills);
  }

  private async closeVitalBills(data: BillUpdate[]) {
    const vitalIds = data.filter((bill) => bill.type === 'vital').map((bill) => bill.id);
    const currentDate = dayjs().toDate();

    if (vitalIds.length === 0) {
      return;
    }

    const vitalBillsToUpdate = await billRepository.findByIds(vitalIds);

    vitalBillsToUpdate.forEach((bill) => {
      const nextDueDate = dayjs(bill.dueDate).add(1, 'month').toDate();

      if (nextDueDate >= currentDate) {
        bill.status = 'pending';
      }

      bill.dueDate = nextDueDate;
    });

    await billRepository.bulkUpdate(vitalBillsToUpdate);
  }
}

export const billService = new BillService();
