import { Form, Switch } from 'antd';
import DatePickerForm from '../DatePicker';

const DueDateFields = ({
  setDateValue,
  setIsPaid,
}: {
  setDateValue: (value: Date) => void;
  setIsPaid: (isPaid: boolean) => void;
}) => {
  return (
    <>
      <Form.Item
        className="col-span-2"
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

      <span className="flex gap-2">
        <Switch onChange={(checked) => setIsPaid(checked)} />
        Esta conta está paga?
      </span>
    </>
  );
};

export default DueDateFields;
