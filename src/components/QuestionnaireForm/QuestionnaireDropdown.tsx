import React from 'react';
import { Select } from '@chakra-ui/react';

const DEFAULT_VALUE = 'DEFAULT';

// TODO: react-hook-form is not playing nicely with the default value - review
export const QuestionnaireDropdown: React.FC<{
  id: string;
  field: any;
  register: any;
}> = ({ id, field, register }) => {
  return (
    <Select
      autoFocus
      defaultValue={DEFAULT_VALUE}
      size="lg"
      variant="outline"
      {...register(`${id}`, { required: true })}
    >
      <option key="DEFAULT" value="DEFAULT" disabled>
        {' -- select an option -- '}
      </option>
      {Object.values(field.value).map((value: any) => (
        <option
          key={`${id}.${value.value || value}`}
          value={value.value || value}
        >
          {value.text || value.value || value}
        </option>
      ))}
    </Select>
  );
};
