import {
  Box,
  FormControl as ChakraFormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';

type Props = {
  children: React.ReactNode;
  error?: string | undefined;
  id?: string | undefined;
  label?: string;
};

const FormControl: React.FC<Props> = ({ children, error, id, label }) => {
  return (
    <ChakraFormControl isInvalid={!!error}>
      <Box mb="1rem">
        {/* Field label */}
        {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
        {/* Field */}
        {children}
        {/* Field error */}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </Box>
    </ChakraFormControl>
  );
};

export default FormControl;
