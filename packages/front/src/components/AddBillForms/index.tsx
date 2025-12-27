import { Form, Modal, Radio } from 'antd';
import { useState } from 'react';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import BaseFields from './BaseFields';
import DueDateFields from './DueDateFields';
import InstallmentFields from './InstallmentFields';
import type { BillInput } from '../../../../api/src/billings/billValidator';
import { trpc } from '../../utils/trpc';
import { checkStatusBill } from '../../utils/functions';

const AddBill = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [option, setOption] = useState<'debit' | 'credit' | 'vital'>('debit');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [form] = Form.useForm<BillInput>();
  const newBill = trpc.bill.newBill.useMutation();

  const options: CheckboxGroupProps<string>['options'] = [
    { label: 'Débito', value: 'debit' },
    { label: 'Crédito', value: 'credit' },
    { label: 'Vitalícia', value: 'vital' },
  ];

  const handleChangeOption = (value: 'debit' | 'credit' | 'vital') => {
    setOption(value);
  };

  const handleSetFormValue = (value: Date) => {
    form.setFieldValue('dueDate', value);
  };

  const submitForm = (values: BillInput) => {
    if (values.type === 'debit') {
      newBill.mutate({ ...values, status: 'paid' });
      return;
    }

    const status = checkStatusBill(isPaid, form.getFieldValue('dueDate'));
    newBill.mutate({ ...values, status });
  };

  return (
    <Modal
      title="Adicionar Conta"
      onCancel={() => setIsOpen(false)}
      onOk={() => form.submit()}
      open={isOpen}
    >
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        onFinish={submitForm}
        initialValues={{ type: 'debit', status: false }}
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
            onChange={(type) => handleChangeOption(type.target.value)}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          {option === 'vital' && (
            <DueDateFields setDateValue={handleSetFormValue} setIsPaid={setIsPaid} />
          )}

          {option === 'credit' && (
            <InstallmentFields setDateValue={handleSetFormValue} setIsPaid={setIsPaid} />
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default AddBill;
