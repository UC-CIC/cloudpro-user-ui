import React from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

export const QuesitonnaireNumberInput: React.FC<{
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
        <NumberInput
          {...fieldProps}
          allowMouseWheel
          max={field.max}
          min={field.min}
          onChange={(value: string) =>
            fieldProps.onChange(value ? Number(value) : value)
          }
          size="lg"
          step={field.step}
        >
          <NumberInputField autoFocus placeholder="Input a number" />
          {field.step && (
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          )}
        </NumberInput>
      )}
      rules={{ required: true }}
    />
  );
};
