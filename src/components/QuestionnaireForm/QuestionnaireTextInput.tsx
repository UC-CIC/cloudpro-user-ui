import React from 'react';
import { Input } from '@chakra-ui/react';

export const QuestionnaireTextInput: React.FC<{
  id: string;
  field: any;
  register: any;
}> = ({ id, field, register }) => {
  return (
    <Input
      autoFocus
      id={id}
      size="lg"
      type="number"
      {...register(id, { required: true })}
      placeholder="Input a value"
    />
  );
};
