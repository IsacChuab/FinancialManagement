import { useState } from 'react';

import { Form, InputNumber, Switch } from 'antd';
import MaskedInput from '../../utils/MaskedInput';
import DatePickerForm from '../DatePicker';
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
        label="Dia do Vencimento"
        name="dueDate"
        rules={[
          {
            required: true,
            message: 'Insira uma data de vencimento',
          },
        ]}
      >
        <DatePickerForm onChange={(date) => setDateValue(date)} date={dateEdit} />
      </Form.Item>

      <Form.Item
        label="Valor Parcela"
        name="valueInstallment"
        rules={[
          {
            required: true,
            message: 'Insira o valor da parcela',
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
        label="Parcela Atual"
        name="currentInstallment"
        rules={[
          {
            required: true,
            message: 'Insira a parcela atual',
          },
        ]}
      >
        <InputNumber min={1} className="w-full!" />
      </Form.Item>

      <Form.Item
        label="Parcelas Totais"
        name="totalInstallments"
        rules={[
          {
            required: true,
            message: 'Insira a quantidade de parcelas',
          },
        ]}
      >
        <InputNumber min={1} className="w-full!" />
      </Form.Item>

      <span className="flex gap-2">
        <Switch onChange={(checked) => setIsPaid(checked)} />
        Esta conta está paga?
      </span>
    </>
  );
};

export default InstallmentFields;
