import type { BillWithActions } from "@isac-chuab/financial-shared";
import { Dexie, type EntityTable } from "dexie"

const db = new Dexie('bills') as Dexie & {
  bill: EntityTable<BillWithActions, 'id'>
};

db.version(1).stores({
  bill: 'id, status, dueDate'
});

export { db }
