import React from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { Radio, RadioGroup, Stack } from '@chakra-ui/react';

export const QuestionnaireRadio: React.FC<{
  control: any;
  field: any;
  id: string;
  register: any;
}> = ({ control, field, id, register }) => {
  return (
    <Controller
      control={control}
      name={id}
      render={({ field: fieldProps }: { field: ControllerRenderProps }) => (
        <RadioGroup
          {...fieldProps}
          onChange={(value: any) => fieldProps.onChange(value)}
          size="lg"
        >
          <Stack direction="column" spacing="0.7rem">
            {Object.values(field.value).map((value: any) => (
              <Radio
                key={`${id}.${value.value || value}`}
                spacing="1rem"
                value={value.value || value}
              >
                {value.text || value.value || value}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      )}
      rules={{ required: true }}
    />
  );
};
