import React, { useMemo } from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import {
  Box,
  Radio as ChakraRadio,
  RadioGroup,
  RadioGroupProps,
  Stack,
} from '@chakra-ui/react';

interface RadioProps extends Omit<RadioGroupProps, 'children'> {
  values: { text: any; value: any }[];
}

const RadioCompact = ({ values, ...props }: RadioProps) => (
  <RadioGroup size="sm" variant="compact" {...props}>
    <Stack direction="row" spacing="0.7rem">
      {values.map(({ text, value }) => (
        <ChakraRadio
          key={value}
          flexDirection="column"
          spacing="0"
          value={value}
        >
          <Box mt="1" textAlign="center">
            {text ?? value}
          </Box>
        </ChakraRadio>
      ))}
    </Stack>
  </RadioGroup>
);

const Radio = ({ values, ...props }: RadioProps) => (
  <RadioGroup size="lg" {...props}>
    <Stack direction="column" spacing="0.7rem">
      {values.map(({ text, value }) => (
        <ChakraRadio key={value} spacing="1rem" value={value}>
          {text ?? value}
        </ChakraRadio>
      ))}
    </Stack>
  </RadioGroup>
);

export const QuestionnaireRadio: React.FC<{
  compact?: boolean;
  control: any;
  field: any;
  id: string;
}> = ({ compact = false, control, field, id }) => {
  const fieldValues = useMemo(
    () =>
      Object.values(field.value).map((value: any) => ({
        value: (value.value ?? value).toString(),
        text: (value.text ?? value.value ?? value).toString(),
      })),
    [field],
  );

  const RadioComponent = compact ? RadioCompact : Radio;

  return (
    <Controller
      control={control}
      name={id}
      render={({
        field: { ref, ...fieldProps },
      }: {
        field: ControllerRenderProps;
      }) => (
        <RadioComponent
          {...fieldProps}
          onChange={(value: any) => fieldProps.onChange(value)}
          values={fieldValues}
        />
      )}
      rules={{ required: true }}
    />
  );
};
