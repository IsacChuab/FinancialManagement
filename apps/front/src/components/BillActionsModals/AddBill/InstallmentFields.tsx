import { useState } from 'react';

import { Form, InputNumber, Switch } from 'antd';
import MaskedInput from '../../../utils/MaskedInput';
import DatePickerForm from '../../DatePicker';
import type { Dayjs } from 'dayjs';

const InstallmentFields = ({
  setDateValue,
  setIsPaid,
  dateEdit,
}: {
  setDateValue: (value: Date) => void;
  setIsPaid: (isPaid: boolean) => void;
  dateEdit?: Dayjs;
}) => {
  const [value, setValue] = useState<string | number>();

  const handleInputChange = (event: string | number) => {
    setValue(event);
  };

  return (
    <>
      <Form.Item
        label="Due Day"
        name="dueDate"
        rules={[
          {
            required: true,
            message: 'Enter a due date',
          },
        ]}
      >
        <DatePickerForm onChange={(date) => setDateValue(date)} date={dateEdit} />
      </Form.Item>

      <Form.Item
        label="Installment Amount"
        name="valueInstallment"
        rules={[
          {
            required: true,
            message: 'Enter the installment amount',
          },
        ]}
      >
        <MaskedInput
          id="valueInstallment"
          name="valueInstallment"
          type="number"
          prefix="R$"
          message={''}
          onChange={(value: string | number) => handleInputChange(value)}
          value={value}
        />
      </Form.Item>

      <Form.Item
        label="Current Installment"
        name="currentInstallment"
        rules={[
          {
            required: true,
            message: 'Enter the current installment',
          },
        ]}
      >
        <InputNumber min={1} className="w-full!" />
      </Form.Item>

      <Form.Item
        label="Total Installments"
        name="totalInstallments"
        rules={[
          {
            required: true,
            message: 'Enter the number of installments',
          },
        ]}
      >
        <InputNumber min={1} className="w-full!" />
      </Form.Item>

      <span className="flex gap-2">
        <Switch onChange={(checked) => setIsPaid(checked)} />
        Is this bill paid?
      </span>
    </>
  );
};

export default InstallmentFields;
