import type { BillWithActions } from "@isac-chuab/financial-shared"
import InfoBills from ".";
import { useBillActions } from "../../hooks/useBillActions";
import { Button, Spin, Table, Tooltip } from "antd";
import { AiOutlineArrowRight, AiOutlinePlusCircle } from "react-icons/ai";
import { BsListNested } from "react-icons/bs";
import { PiListStarFill } from "react-icons/pi";

import { useState } from "react";
import BillActionsModals from "../BillActionsModals";
import { columns } from "../../pages/financial/dashboardColumns";
import SortableRow from "../SortableRow";

type BillProps = {
  bills: BillWithActions[];
  onReorder: (params: { sourceId: string; targetId: string }) => void;
}

const BillsView = ({bills, onReorder}: BillProps) => {
	const billActions = useBillActions();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'add' | 'edit' | 'delete' | 'closeMonth'>('add');
  const [activeBill, setActiveBill] = useState<BillWithActions | undefined>(undefined);
  const [viewType, setViewType] = useState<'card' | 'list'>('card');

	const setActionType = (action: 'add' | 'edit' | 'delete' | 'closeMonth', bill?: BillWithActions) => {
		if (action === 'edit' || action === 'delete') {
			setActiveBill(bill || undefined);
		}

    setType(action);
    setIsOpen(true);
  };

	return (
		<>
			<div className="flex justify-between items-center">
				<div className="w-full flex justify-between gap-3 md:flex-row md:w-fit">
          <Button type="primary" onClick={() => setActionType('add')}>
            Adicionar Conta <AiOutlinePlusCircle />
          </Button>

          <Button
            type="default"
            onClick={() => setActionType('closeMonth')}
            disabled={!bills?.length}
          >
            Finalizar Mês <AiOutlineArrowRight />
          </Button>
        </div>

        <div className="hidden md:block">
          <Tooltip title={viewType === 'card' ? 'Visualizar em lista' : 'Visualizar em cartões'}>
            <Button
              type="default"
              onClick={() => setViewType(viewType === 'card' ? 'list' : 'card')}
              disabled={!bills?.length}
            >
              {viewType === 'card' ? <BsListNested size={18} /> : <PiListStarFill size={18} />}
            </Button>
          </Tooltip>
        </div>
      </div>

			{billActions.isPendingListBills && <Spin description="Carregando contas..." />}

      {viewType === 'list' && (
        <Table
          dataSource={bills}
          columns={columns({ billActions, handleActions: setActionType })}
          pagination={false}
          loading={billActions.isPendingListBills}
          rowKey="id"
          components={{
            body: {
              row: (props: { "data-row-key": string; children: React.ReactNode }) => {
                const bill = bills.find(b => b.id === props["data-row-key"]);

                return (
                  <SortableRow
                    record={bill || { id: props["data-row-key"] }}
                    onReorder={onReorder}
                  >
                    {props.children}
                  </SortableRow>
                );
              },
            },
          }}
        />
      )}

      {viewType === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bills.map((bill) => (
            <InfoBills
              key={bill.id}
              bill={bill}
              handleActions={billActions}
              handleAction={setActionType}
              onReorder={onReorder}
            />
          ))}
        </div>
      )}

			<BillActionsModals type={type} isOpen={isOpen} setIsOpen={setIsOpen} activeBill={activeBill} />
		</>
	)
};

export default BillsView;