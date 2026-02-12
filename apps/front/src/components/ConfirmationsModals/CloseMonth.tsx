import { Button, Modal } from 'antd';
import { useRef } from 'react';

const CloseMonthModal = ({
  isOpen,
  isSomeBillOpened,
  name,
  loading,
  onConfirm,
  setModalIsOpen,
}: {
  isOpen: boolean;
  isSomeBillOpened: boolean;
  name: string;
  loading: boolean;
  onConfirm: () => void;
  setModalIsOpen: (isOpen: boolean) => void;
}) => {
    const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Modal
      title="Finalizar Mês"
      onCancel={() => setModalIsOpen(false)}
      onOk={onConfirm}
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
            {isSomeBillOpened && 'Existem contas atrasadas ou pendentes que não foram pagas.'}
          </span>
        </div>
        

        <span>
          Mês de <b>{name}</b>
        </span>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button key="cancel" onClick={() => setModalIsOpen(false)} disabled={loading}>
          Cancelar
        </Button>

        <Button
          key="confirm"
          type="primary"
          onClick={onConfirm}
          loading={loading}
          ref={confirmButtonRef}
        >
          Finalizar
        </Button>
      </div>
    </Modal>
  );
};

export default CloseMonthModal;
