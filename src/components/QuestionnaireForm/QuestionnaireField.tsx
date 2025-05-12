import React from 'react';
import {
  Box,
  FormHelperText,
  FormLabel,
  FormControl,
  Text,
} from '@chakra-ui/react';

export const QuestionnaireField: React.FC<{
  children: React.ReactNode;
  compact?: boolean;
  description?: string | undefined;
  disabled?: boolean;
  id: string;
  label: string;
}> = ({
  children,
  compact = false,
  description,
  disabled = false,
  id,
  label,
}) => {
  return (
    <FormControl py={compact ? '1.5rem' : '0.5rem'}>
      <Box mb="1.2rem">
        {label && (
          <FormLabel htmlFor={id} maxWidth="80%">
            <Text fontSize={compact ? 'xl' : '2xl'}>{label}</Text>
          </FormLabel>
        )}

        {description && (
          <FormHelperText fontSize="md">{description}</FormHelperText>
        )}
      </Box>

      <fieldset disabled={disabled}>{children}</fieldset>
    </FormControl>
  );
};
