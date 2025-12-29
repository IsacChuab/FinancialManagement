import { Form, Modal, Radio, Button } from 'antd';
import { useState } from 'react';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import BaseFields from './BaseFields';
import DueDateFields from './DueDateFields';
import InstallmentFields from './InstallmentFields';
import type { BillInput } from '../../../../api/src/billings/billValidator';
import { useBillActions } from '../../hooks/useBillActions';

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
  const { newBill, isPending } = useBillActions();

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
    newBill(values, isPaid);
    setIsOpen(false);
  };

  return (
    <Modal
      title="Adicionar Conta"
      onCancel={() => setIsOpen(false)}
      onOk={() => form.submit()}
      open={isOpen}
      footer={[
        <Button key="cancel" onClick={() => setIsOpen(false)}>
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
