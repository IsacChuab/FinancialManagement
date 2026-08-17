import { Button, Modal } from 'antd';
import { useRef } from 'react';
import { useBillActions } from '../../hooks/useBillActions';
import dayjs from '../../utils/dayjs';

const CloseMonth = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isPendingCloseMonth, getSomeLatedOrPendingBill, closeMonth } = useBillActions();
  const currentMonth = dayjs().format('MMMM');

  const handleCloseMonth = async () => {
    const isSuccess = await closeMonth();

    if (isSuccess) {
      closeModal();
    }
  }

  return (
    <Modal
      title={<>Close out<span className='capitalize'> {currentMonth}</span></>}
      onCancel={closeModal}
      onOk={() => void handleCloseMonth()}
      open={isOpen}
      footer={null}
      afterOpenChange={(open) => {
        if (open) {
          confirmButtonRef.current?.focus();
        }
      }}
    >
      <div className="flex flex-col gap-2 mt-6">
        <span className='block'>Are you sure you want to close out the month?</span>
        <span className='block'>This action cannot be undone.</span>

        <span className="text-red-600 font-semibold">
          {getSomeLatedOrPendingBill() && 'There are late or pending bills that have not been paid.'}
        </span>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button key="cancel" onClick={closeModal} disabled={isPendingCloseMonth}>
          Cancel
        </Button>

        <Button
          key="confirm"
          type="primary"
          onClick={() => void handleCloseMonth()}
          loading={isPendingCloseMonth}
          ref={confirmButtonRef}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default CloseMonth;
