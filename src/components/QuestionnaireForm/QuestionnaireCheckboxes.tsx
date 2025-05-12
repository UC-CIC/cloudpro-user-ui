import React, { useMemo } from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  Stack,
  useColorMode 
} from '@chakra-ui/react';

interface CheckboxesProps extends CheckboxGroupProps {
  values: { text: any; value: any }[];
}

const CheckboxesCompact = ({ values, ...props }: CheckboxesProps) => (
  <CheckboxGroup size="sm" variant="compact" {...props}>
    <Stack direction="row" spacing="0.7rem">
      {values.map(({ text, value }) => (
        <Checkbox
          flexDirection="column"
          textAlign="center"
          key={value}
          spacing="0"
          value={value}
          color={props.colorScheme === 'white' ? "white" : "black"}
        >
          {text ?? value}
        </Checkbox>
      ))}
    </Stack>
  </CheckboxGroup>
);

const Checkboxes = ({ values, ...props }: CheckboxesProps) => (
  <CheckboxGroup size="lg" {...props}>
    <Stack direction="column" spacing="0.7rem">
      {values.map(({ text, value }) => (
        <Checkbox key={value} spacing="1rem" value={value}>
          {text ?? value}
        </Checkbox>
      ))}
    </Stack>
  </CheckboxGroup>
);

export const QuestionnaireCheckboxes: React.FC<{
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

  const CheckboxComponent = compact ? CheckboxesCompact : Checkboxes;
  const { colorMode } = useColorMode();
  return (
    
    <Controller
      control={control}
      name={id}
      render={({
        field: { ref, ...fieldProps },
      }: {
        field: ControllerRenderProps;
      }) => (
        <CheckboxComponent
          {...fieldProps}
          colorScheme={colorMode === "light" ? "black" : "white"}
          onChange={(value: any) => fieldProps.onChange(value)}
          values={fieldValues}
        />
      )}
      rules={{ required: true }}
    />
  );
};
