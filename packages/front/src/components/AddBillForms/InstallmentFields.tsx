import { Form, InputNumber } from 'antd';
import MaskedInput from '../../utils/MaskedInput';
import { useState } from 'react';

const InstallmentFields = () => {
  const [value, setValue] = useState<string | number>();

  const handleInputChange = (event: string | number) => {
    setValue(event);
  };

  return (
    <>
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
    </>
  );
};

export default InstallmentFields;
