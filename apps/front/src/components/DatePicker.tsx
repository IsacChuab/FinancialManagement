import { Dayjs } from 'dayjs';
import { DatePicker as AntDatePicker } from 'antd';
import { useState } from 'react';

interface DatePickerFormProps {
  onChange: (date: Date) => void;
  date?: Dayjs;
}

const DatePickerForm = ({ onChange, date }: DatePickerFormProps) => {
  const [changeDate, setChangeDate] = useState<Dayjs>();

  const handleChangeDate = (date: Dayjs | null) => {
    if (date) {
      onChange(date.toDate());
      setChangeDate(date);
    }
  };

  return (
    <AntDatePicker
      onChange={handleChangeDate}
      format="DD/MM/YYYY"
      className="w-full"
      value={changeDate || date}
    />
  );
};

export default DatePickerForm;
