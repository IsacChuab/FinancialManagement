import type { BillWithActions } from "@isac-chuab/financial-shared";
import { db } from "../db/database";

export const bulkStores = async (data: BillWithActions[]) => {
  await db.transaction('rw', db.bill, async () => {
  await db.bill.clear();
  await db.bill.bulkAdd(data);
});
}