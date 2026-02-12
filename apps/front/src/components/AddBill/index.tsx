import { useEffect, useState } from 'react';

import type { BillInput } from '@isac-chuab/financial-shared';
import type { BillWithActions } from '@isac-chuab/financial-shared';

import { Form, Modal, Radio, Button, type RadioChangeEvent } from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import dayjs from 'dayjs';

import BaseFields from './BaseFields';
import DueDateFields from './DueDateFields';
import InstallmentFields from './InstallmentFields';
import { useBillActions } from '../../hooks/useBillActions';

const AddBill = ({
  isOpen,
  closeModal,
  billToEdit,
  bills,
}: {
  isOpen: boolean;
  closeModal: () => void;
  billToEdit?: BillWithActions;
  bills: BillWithActions[];
}) => {
  const [option, setOption] = useState<'debit' | 'credit' | 'vital'>('debit');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [form] = Form.useForm<BillInput>();
  const { newBill, isPendingNewBill, updateBill } = useBillActions();

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
      updateBill(billToEdit.id, { ...values, order: billToEdit.order }, isPaid);
      form.resetFields();
      closeModal();
      setOption('debit');
      setIsPaid(false);
      return;
    }

    newBill(values, isPaid, bills);
    form.resetFields();
    setOption('debit');
    setIsPaid(false);
    closeModal();
  };

  const handleCancel = () => {
    form.resetFields();
    setOption('debit');
    setIsPaid(false);
    closeModal();
  };

  useEffect(() => {
    if (billToEdit) {
      form.setFieldsValue(billToEdit as BillInput);
      setOption(billToEdit.type);
      return;
    }

    form.resetFields();
    setOption('debit');
    setIsPaid(false);
  }, [billToEdit, form]);

  return (
    <Modal
      title="Adicionar Conta"
      onCancel={handleCancel}
      onOk={form.submit}
      open={isOpen}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        onFinish={submitForm}
        initialValues={{ type: 'debit' }}
        disabled={isPendingNewBill}
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

        <div className="flex justify-end gap-2 mt-6">
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>

          <Button
            key="ok"
            type="primary"
            htmlType='submit'
            loading={isPendingNewBill}
            disabled={isPendingNewBill}
            onClick={() => form.submit()}
          >
            Salvar
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddBill;
