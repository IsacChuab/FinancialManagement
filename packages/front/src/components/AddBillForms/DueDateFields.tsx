import { Form } from 'antd';
import { cn } from '../../utils/cn';
import DatePickerForm from '../DatePicker';

const DueDateFields = ({
  option,
  setDateValue,
}: {
  option: string;
  setDateValue: (value: Date) => void;
}) => {
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
      <DatePickerForm onChange={(date) => setDateValue(date)} />
    </Form.Item>
  );
};

export default DueDateFields;
