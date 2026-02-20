import type { BillWithActions } from "@isac-chuab/financial-shared"
import InfoBills from ".";
import { useBillActions } from "../../hooks/useBillActions";
import { Button, Spin } from "antd";
import { AiOutlineArrowRight, AiOutlinePlusCircle } from "react-icons/ai";
import { useState } from "react";
import BillActionsModals from "../BillActionsModals";

const BillsView = ({bills, onReorder}: {bills: BillWithActions[], onReorder: (params: { sourceId: string; targetId: string }) => void}) => {
	const billActions = useBillActions();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'add' | 'edit' | 'delete' | 'closeMonth'>('add');
  const [activeBill, setActiveBill] = useState<BillWithActions | undefined>(undefined);
	
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
				<div className="flex flex-col gap-3 md:flex-row">
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
      </div>

			{billActions.isPendingListBills && <Spin description="Carregando contas..." />}

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

			 {/*colocar botão para escolher se quer card ou table, ajustar o reorder para funcionar na table
				<Table
					dataSource={data}
					columns={columns({ billActions, handleEdit, handleDelete })}
					pagination={false}
					loading={isPending}
					scroll={{ y: 'calc(100vh - 300px)' }}
				/>*/}
			</div>

			<BillActionsModals type={type} isOpen={isOpen} setIsOpen={setIsOpen} activeBill={activeBill} />
		</>
	)
};

export default BillsView;