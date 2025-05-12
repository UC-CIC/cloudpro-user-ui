import React from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { Input,useColorMode } from '@chakra-ui/react';

export const QuestionnaireTextInput: React.FC<{
  control: any;
  id: string;
  field: any;
  register: any;
}> = ({ control, id, field, register }) => {
  const { colorMode } = useColorMode();
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
          color={colorMode === "light" ? "black" : "white"}
          placeholder="Input a value"
          value={field.value || field.state || ''}
        />
      )}
    />
  );
};
