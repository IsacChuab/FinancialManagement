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
        label="Name"
        name="name"
        rules={[
          { required: true, message: 'Please enter a name' },
          { min: 3, message: 'Name must be at least 3 characters long' }
          ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: 'Please enter an amount' }]}
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
