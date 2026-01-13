import { Button, Modal } from 'antd';

const CloseMonthModal = ({
  isOpen,
  name,
  loading,
  onConfirm,
  setModalIsOpen,
}: {
  isOpen: boolean;
  name: string;
  loading: boolean;
  onConfirm: () => void;
  setModalIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <Modal
      title="Finalizar Mês"
      onCancel={() => setModalIsOpen(false)}
      onOk={onConfirm}
      open={isOpen}
      footer={[
        <Button key="cancel" onClick={() => setModalIsOpen(false)}>
          Cancelar
        </Button>,

        <Button key="ok" type="primary" loading={loading} disabled={loading} onClick={onConfirm}>
          Finalizar
        </Button>,
      ]}
    >
      <div className="flex flex-col gap-2 mt-6">
        <span>Tem certeza que deseja finalizar o mês?</span>
        <span>
          Mês de <b>{name}</b>
        </span>
      </div>
    </Modal>
  );
};

export default CloseMonthModal;
