import { Form } from 'antd';
import MaskedInput from '../../utils/MaskedInput';
import Input from 'antd/es/input/Input';
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
          {
            min: 1,
            message: 'A parcela atual deve ser maior ou igual a 1',
          },
        ]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label="Parcelas Totais"
        name="totalInstallments"
        rules={[
          {
            required: true,
            message: 'Insira a quantidade de parcelas',
          },
          {
            min: 1,
            message: 'O total de parcelas deve ser maior ou igual a 1',
          },
        ]}
      >
        <Input type="number" />
      </Form.Item>
    </>
  );
};

export default InstallmentFields;
