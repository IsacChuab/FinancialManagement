import { Form, Modal, Radio } from 'antd';
import { useState } from 'react';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import BaseFields from './BaseFields';
import DueDateFields from './DueDateFields';
import InstallmentFields from './InstallmentFields';

type FieldsForm = {
  name: string;
  amount: string;
  type: 'debit' | 'credit' | 'vital';
  dueDate: string;
  valueInstallment: string;
  currentInstallment: number;
  totalInstallments: number;
};

const AddBill = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [option, setOption] = useState<'debit' | 'credit' | 'vital'>('debit');
  const [form] = Form.useForm<FieldsForm>();

  const options: CheckboxGroupProps<string>['options'] = [
    { label: 'Débito', value: 'debit' },
    { label: 'Crédito', value: 'credit' },
    { label: 'Vitalícia', value: 'vital' },
  ];

  const handleChangeOption = (value: 'debit' | 'credit' | 'vital') => {
    setOption(value);
  };

  const submitForm = () => {
    console.log('forms result', form.getFieldsValue());
    form.submit();
  };

  return (
    <Modal
      title="Adicionar Conta"
      onCancel={() => setIsOpen(false)}
      onOk={submitForm}
      open={isOpen}
    >
      <Form form={form} layout="vertical" className="w-full">
        <BaseFields />

        <Form.Item className="col-span-2" name="type">
          <Radio.Group
            block
            options={options}
            defaultValue="debit"
            optionType="button"
            buttonStyle="solid"
            onChange={(type) => handleChangeOption(type.target.value)}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          {(option === 'credit' || option === 'vital') && <DueDateFields option={option} />}

          {option === 'credit' && <InstallmentFields />}
        </div>
      </Form>
    </Modal>
  );
};

export default AddBill;
