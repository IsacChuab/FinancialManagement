import { DatePicker, Form } from 'antd';
import { cn } from '../../utils/cn';

const DueDateFields = ({ option }: { option: string }) => {
  return (
    <Form.Item
      className={cn({ 'col-span-2': option === 'vital' })}
      label="Dia do Vencimento"
      name="dueDate"
      rules={[
        {
          required: true,
          message: 'Insira uma data de vencimento',
        },
      ]}
    >
      <DatePicker className="w-full" format="DD/MM/YYYY" />
    </Form.Item>
  );
};

export default DueDateFields;
