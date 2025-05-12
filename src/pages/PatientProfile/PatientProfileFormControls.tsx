import { Box, Button, InputGroup } from '@chakra-ui/react';

type Props = {
  isFirstStep?: boolean;
  isFormValid?: boolean;
  isLastStep?: boolean;
  onStepChange: (stepSize: number) => any;
};

const PatientProfileFormControls: React.FC<Props> = ({
  isFirstStep,
  isFormValid,
  isLastStep,
  onStepChange,
}) => {
  return (
    <InputGroup>
      {!isFirstStep && (
        <>
          <Button onClick={() => onStepChange(-1)} width="full" variant="solid">
            Back
          </Button>
          <Box width="8" />
        </>
      )}

      <Button
        colorScheme="teal"
        isDisabled={!isFormValid}
        onClick={() => onStepChange(1)}
        width="full"
      >
        {isLastStep ? 'Complete' : 'Next'}
      </Button>
    </InputGroup>
  );
};

export default PatientProfileFormControls;
