import { Dayjs } from 'dayjs';
import { DatePicker as AntDatePicker } from 'antd';

interface DatePickerFormProps {
  onChange: (date: Date) => void;
}

const DatePickerForm = ({ onChange }: DatePickerFormProps) => {
  const handleChangeDate = (date: Dayjs | null) => {
    if (date) {
      onChange(date.toDate());
    }
  };

  return <AntDatePicker onChange={handleChangeDate} format="DD/MM/YYYY" className="w-full" />;
};

export default DatePickerForm;
