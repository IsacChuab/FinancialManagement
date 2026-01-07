import { Form, Modal, Radio, Button, type RadioChangeEvent } from 'antd';
import { useEffect, useState } from 'react';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import BaseFields from './BaseFields';
import DueDateFields from './DueDateFields';
import InstallmentFields from './InstallmentFields';
import type { BillInput } from '../../../../api/src/billings/billValidator';
import { useBillActions } from '../../hooks/useBillActions';
import type { BillWithActions } from '../../../../api/src/billings/billTypes';
import dayjs from 'dayjs';

const AddBill = ({
  isOpen,
  closeModal,
  billToEdit,
}: {
  isOpen: boolean;
  closeModal: () => void;
  billToEdit?: BillWithActions;
}) => {
  const [option, setOption] = useState<'debit' | 'credit' | 'vital'>('debit');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [form] = Form.useForm<BillInput>();
  const { newBill, isPending, updateBill } = useBillActions();

  const options: CheckboxGroupProps<string>['options'] = [
    { label: 'Débito', value: 'debit' },
    { label: 'Crédito', value: 'credit' },
    { label: 'Vitalícia', value: 'vital' },
  ];

  const handleChangeOption = (value: RadioChangeEvent) => {
    setOption(value.target.value as 'debit' | 'credit' | 'vital');
  };

  const handleSetDateValue = (value: Date) => {
    form.setFieldValue('dueDate', value);
  };

  const submitForm = (values: BillInput) => {
    if (billToEdit) {
      updateBill(billToEdit.id, { ...values }, isPaid);
      closeModal();
      return;
    }

    newBill(values, isPaid);
    closeModal();
  };

  useEffect(() => {
    if (billToEdit) {
      form.setFieldsValue(billToEdit);
      setOption(billToEdit.type);
      return;
    }

    form.resetFields();
    setOption('debit');
  }, [billToEdit, form]);

  return (
    <Modal
      title="Adicionar Conta"
      onCancel={closeModal}
      onOk={form.submit}
      open={isOpen}
      footer={[
        <Button key="cancel" onClick={closeModal}>
          Cancelar
        </Button>,

        <Button
          key="ok"
          type="primary"
          loading={isPending}
          disabled={isPending}
          onClick={() => form.submit()}
        >
          Salvar
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        onFinish={submitForm}
        initialValues={{ type: 'debit' }}
        disabled={isPending}
      >
        <BaseFields />

        <Form.Item className="col-span-2" name="type">
          <Radio.Group
            name="type"
            block
            options={options}
            defaultValue="debit"
            optionType="button"
            buttonStyle="solid"
            onChange={handleChangeOption}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          {option === 'vital' && (
            <DueDateFields
              setDateValue={handleSetDateValue}
              setIsPaid={setIsPaid}
              dateEdit={billToEdit && dayjs(billToEdit.dueDate)}
            />
          )}

          {option === 'credit' && (
            <InstallmentFields
              setDateValue={handleSetDateValue}
              setIsPaid={setIsPaid}
              dateEdit={billToEdit && dayjs(billToEdit.dueDate)}
            />
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default AddBill;
