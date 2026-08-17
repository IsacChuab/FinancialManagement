import type { BillWithActions } from "@isac-chuab/financial-shared"
import InfoBills from ".";
import { useBillActions } from "../../hooks/useBillActions";
import { Button, Card, Empty, Spin, Table, Tooltip, Typography } from "antd";
import { AiOutlineArrowRight, AiOutlinePlusCircle } from "react-icons/ai";
import { BsListNested } from "react-icons/bs";
import { PiListStarFill } from "react-icons/pi";
import { MdCalendarMonth } from "react-icons/md";

import { useEffect, useState } from "react";
import BillActionsModals from "../BillActionsModals";
import { columns } from "../../pages/financial/dashboardColumns";
import SortableRow from "../SortableRow";
import { bulkStores } from "../../infrastructure/repositories/billRepository";
import { useOffline } from "../../providers/OfflineProvider";

const { Title } = Typography;

type BillProps = {
  bills: BillWithActions[];
  title: string;
  onReorder: (params: { sourceId: string; targetId: string }) => void;
}

const BillsView = ({ bills, title, onReorder }: BillProps) => {
  const { isOffline } = useOffline();
  const billActions = useBillActions();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'add' | 'edit' | 'delete' | 'closeMonth'>('add');
  const [activeBill, setActiveBill] = useState<BillWithActions | undefined>(undefined);
  const [viewType, setViewType] = useState<'card' | 'list'>('card');

  const setActionType = (action: 'add' | 'edit' | 'delete' | 'closeMonth', bill?: BillWithActions) => {
    if (isOffline) {
      return;
    }

    if (action === 'edit' || action === 'delete') {
      setActiveBill(bill || undefined);
    }

    setType(action);
    setIsOpen(true);
  };

  const handleCloseModals = () => {
    setIsOpen(false);
    setActiveBill(undefined);
  }

  useEffect(() => {
    async function fetchData() {
      if (!isOffline && billActions.listBills && billActions.listBills?.length > 0) {
        await bulkStores(billActions.listBills)
      }
    }

    void fetchData();
  }, [billActions.listBills, isOffline])

  return (
    <div className="flex flex-col gap-4">
      <Card variant="borderless" className="shadow-sm! rounded-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: '#53D38826' }}
            >
              <MdCalendarMonth className="h-5 w-5" style={{ color: '#1f9d5c' }} />
            </span>
            <Title level={3} className="m-0!">{title}</Title>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="primary" onClick={() => setActionType('add')} disabled={isOffline}>
              Adicionar Conta <AiOutlinePlusCircle />
            </Button>

            <Button
              type="default"
              onClick={() => setActionType('closeMonth')}
              disabled={isOffline || !bills?.length}
            >
              Finalizar Mês <AiOutlineArrowRight />
            </Button>

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
        </div>
      </Card>

      {!isOffline && billActions.isPendingListBills && <Spin description="Carregando contas..." />}

      {!bills.length ? (
        <Empty description="Nenhuma conta registrada" />
      ) : (
        <>
          {viewType === 'list' && (
            <Table
              dataSource={bills}
              columns={columns({ billActions, handleActions: setActionType, isOffline })}
              pagination={false}
              loading={!isOffline && billActions.isPendingListBills}
              rowKey="id"
              rowClassName={(record) =>
                billActions.isPendingBill(record.id) ? 'opacity-50 pointer-events-none' : ''
              }
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
                  isOffline={isOffline}
                />
              ))}
            </div>
          )}
        </>
      )}

      {!isOffline && (
        <BillActionsModals type={type} isOpen={isOpen} handleClose={handleCloseModals} activeBill={activeBill} />
      )}
    </div>
  )
};

export default BillsView;
