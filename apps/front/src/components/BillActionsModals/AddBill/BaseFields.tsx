import { Form, Input } from 'antd';
import MaskedInput from '../../../utils/MaskedInput';
import { useState } from 'react';

const BaseFields = () => {
  const [value, setValue] = useState<string | number>();

  const handleInputChange = (event: string | number) => {
    setValue(event);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Form.Item
        label="Nome"
        name="name"
        rules={[
          { required: true, message: 'Por favor, insira um nome' }, 
          { min: 3, message: 'O nome deve conter pelo menos 3 caracteres' }
          ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Valor"
        name="amount"
        rules={[{ required: true, message: 'Por favor, insira um valor' }]}
      >
        <MaskedInput
          type="number"
          id="total"
          name="amount"
          prefix="R$"
          message={''}
          onChange={(value: string | number) => handleInputChange(value)}
          value={value}
        />
      </Form.Item>
    </div>
  );
};

export default BaseFields;
