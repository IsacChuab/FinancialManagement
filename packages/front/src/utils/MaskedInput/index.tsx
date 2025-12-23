import React, { type ChangeEvent, forwardRef, useCallback } from 'react';

import { Input } from 'antd';
import type { InputRef } from 'antd';

import useMask from './masks';

type MaskedInputProps = {
  id: string;
  name: string;
  value?: string | number;
  message: '' | 'error';
  type?: 'string' | 'number';
  onChange: (value: number | string) => void;
  disabled?: boolean;
  maxLength?: number;
  prefix?: React.ReactNode;
  placeholder?: string;
};

const MaskedInput = forwardRef<InputRef, MaskedInputProps>(
  ({ id, name, value, onChange, type, disabled, maxLength, prefix, placeholder, message }, ref) => {
    const { maskClean, maskedValue } = useMask('money', value);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const cleanValue = maskClean(e.currentTarget.value);

        if (onChange) {
          onChange(type === 'number' ? Number(cleanValue || 0) : cleanValue);
        }
      },
      [maskClean, onChange, type],
    );

    return (
      <Input
        name={name}
        value={maskedValue}
        ref={ref}
        status={message}
        onChange={handleChange}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        prefix={prefix}
        placeholder={placeholder}
      />
    );
  },
);

export default MaskedInput;
