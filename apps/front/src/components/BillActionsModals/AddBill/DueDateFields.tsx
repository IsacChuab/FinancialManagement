import { Form, Switch } from 'antd';
import DatePickerForm from '../../DatePicker';
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

      <span className="flex gap-2">
        <Switch onChange={(checked) => setIsPaid(checked)} />
        Is this bill paid?
      </span>
    </>
  );
};

export default DueDateFields;
