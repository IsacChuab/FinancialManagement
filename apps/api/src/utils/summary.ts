import { type BillModel } from "../billings/repositories/billModel.js";

export const summaryBills = (bills: BillModel[]): {totalDebit: number, totalCredit: number, totalVital: number, total: number} => {
    const debits = bills.filter((bill) => bill.type === 'debit');
    const credits = bills.filter((bill) => bill.type === 'credit');
    const vitals = bills.filter((bill) => bill.type === 'vital');

    const totalDebit = debits.reduce((acc, bill) => acc + bill.amount, 0);
    const totalCredit = credits.reduce((acc, bill) => acc + bill.valueInstallment, 0);
    const totalVital = vitals.reduce((acc, bill) => acc + bill.amount, 0);

    return {
        totalDebit,
        totalCredit,
        totalVital,
        total: totalCredit + totalVital + totalDebit,
    };
}