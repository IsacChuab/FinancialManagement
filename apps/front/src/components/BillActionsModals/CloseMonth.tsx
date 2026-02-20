import { Button, Modal } from 'antd';
import { useRef } from 'react';
import { useBillActions } from '../../hooks/useBillActions';

const CloseMonth = ({
  isOpen,
  setModalIsOpen,
}: {
  isOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isPendingCloseMonth, getSomeLatedOrPendingBill } = useBillActions();

  return (
    <Modal
      title="Finalizar Mês"
      onCancel={() => setModalIsOpen(false)}
      onOk={() => setModalIsOpen(false)}
      open={isOpen}
      footer={null}
      afterOpenChange={(open) => {
        if (open) {
          confirmButtonRef.current?.focus();
        }
      }}
    >
      <div className="flex flex-col gap-2 mt-6">
        <div>
          <span className='block'>Tem certeza que deseja finalizar o mês?</span>
          
          <span className="text-red-600 font-semibold">
            {getSomeLatedOrPendingBill() && 'Existem contas atrasadas ou pendentes que não foram pagas.'}
          </span>
        </div>
        

        <span>
          Mês de <b>test</b>
        </span>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button key="cancel" onClick={() => setModalIsOpen(false)} disabled={isPendingCloseMonth}>
          Cancelar
        </Button>

        <Button
          key="confirm"
          type="primary"
          onClick={() => setModalIsOpen(false)}
          loading={isPendingCloseMonth}
          ref={confirmButtonRef}
        >
          Finalizar
        </Button>
      </div>
    </Modal>
  );
};

export default CloseMonth;
