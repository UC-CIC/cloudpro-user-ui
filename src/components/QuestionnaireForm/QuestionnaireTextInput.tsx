import React from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { Input } from '@chakra-ui/react';

export const QuestionnaireTextInput: React.FC<{
  control: any;
  id: string;
  field: any;
  register: any;
}> = ({ control, id, field, register }) => {
  return (
    <Controller
      control={control}
      name={id}
      render={({ field: fieldProps }: { field: ControllerRenderProps }) => (
        <Input
          {...fieldProps}
          autoFocus
          size="lg"
          type="text"
          placeholder="Input a value"
        />
      )}
    />
  );
};
