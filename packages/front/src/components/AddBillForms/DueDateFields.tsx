import { Form, Switch } from 'antd';
import DatePickerForm from '../DatePicker';
import type { Dayjs } from 'dayjs';

const DueDateFields = ({
  setDateValue,
  setIsPaid,
  dateEdit,
}: {
  setDateValue: (value: Date) => void;
  setIsPaid: (isPaid: boolean) => void;
  dateEdit?: Dayjs;
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
        <DatePickerForm onChange={(date) => setDateValue(date)} date={dateEdit} />
      </Form.Item>

      <span className="flex gap-2">
        <Switch onChange={(checked) => setIsPaid(checked)} />
        Esta conta está paga?
      </span>
    </>
  );
};

export default DueDateFields;
