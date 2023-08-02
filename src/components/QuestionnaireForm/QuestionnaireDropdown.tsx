import React from 'react';
import { Select, useColorMode } from '@chakra-ui/react';

// TODO: react-hook-form is not playing nicely with the default value - review
export const QuestionnaireDropdown: React.FC<{
  id: string;
  field: any;
  register: any;
}> = ({ id, field, register }) => {
  const { colorMode } = useColorMode();

  return (
    <Select
      color={colorMode === 'light' ? 'black' : 'white'}
      autoFocus
      placeholder=" -- select an option -- "
      size="lg"
      variant="outline"
      {...register(`${id}`, { required: true })}
    >
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
