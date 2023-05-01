import React, { useState, useEffect  } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Progress,
  SlideFade,
  Text,
} from '@chakra-ui/react';
import { QuestionnaireCheckboxes } from './QuestionnaireCheckboxes';
import { QuestionnaireDropdown } from './QuestionnaireDropdown';
import { QuestionnaireField } from './QuestionnaireField';
import { QuesitonnaireNumberInput } from './QuesitonnaireNumberInput';
import { QuestionnaireRadio } from './QuestionnaireRadio';
import { QuestionnaireTextInput } from './QuestionnaireTextInput';

type Props = {
  onFormSave: (data: FormData) => any;
  onFormSubmit: (data: FormData) => any;
  steps: Step[];
};

interface FormData {
  [key: string]: {
    [key: string]: string | number;
  };
}

interface Field {
  name: string;
  description?: string | undefined;
  text: string;
  type: string;
  value?: any;
  state?: any;
}

interface Step {
  description?: string;
  fields: Field[];
  name: string;
  text?: string;
}

const STANDALONE_INPUT_MAP = {
  checkbox: QuestionnaireCheckboxes,
  decimal: QuesitonnaireNumberInput,
  dropdown: QuestionnaireDropdown,
  radio: QuestionnaireRadio,
  text: QuestionnaireTextInput,
};

// Helper method to map values using the specified callback function
const mapValues = (val: any, cb: (v: any) => any): any => {
  if (Array.isArray(val)) {
    return val.map((v: any) => mapValues(v, cb));
  } else if (val?.constructor === Object) {
    return Object.entries(val).reduce((obj: any, [key, v]) => {
      obj[key] = mapValues(v, cb);
      return obj;
    }, {});
  } else {
    return cb(val);
  }
};

// Helper method to force values into strings. This is necessary to bypass a
// Chakra UI bug with checkboxes regarding numbers (particularly with the 0
// value).
const mapValuesToString = (val: any): any =>
  mapValues(val, (v: any) => v?.toString());

// Helper method to force values into numbers. Primarily helpful to revert
// values that had to be forced into strings due to the Chakra UI checkbox bug.
const mapValuesToNumber = (val: any) =>
  mapValues(val, (v: any) => (Number.isNaN(Number(v)) ? v : Number(v)));

export const QuestionnaireForm: React.FC<Props> = ({
  onFormSave,
  onFormSubmit,
  steps,
}) => {
  useEffect(() => {

    for (const step of steps) {
      for (const field of step.fields) {
          switch (field.type) {
              case 'checkbox':
              case 'decimal':
              case 'dropdown':
              case 'radio':
              case 'text':
                  if (field.state != null) {
                      setValue(field.name, mapValuesToString(field.state));
                  }
                  break;
              case 'hidden':
                  // TODO
                  setValue(field.name, field.state);
                  break;
              default:
                  console.error(`Invalid type of ${field.type}`);
                  break;
          }
      }
    }
    

  }, [steps]);


  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [fadeOffset, setFadeOffset] = useState('-1rem');
  const {
    control,
    register,
    clearErrors,
    handleSubmit,
    getFieldState,
    getValues,
    setValue,
    formState,
    formState: { errors, isValid: isFormValid },
  } = useForm<FormData>({ mode: 'onTouched' });

  const onSubmit = async (data: FormData) => {
    return onFormSubmit(mapValuesToNumber(data));
  };

  const onSave = async (data: FormData) => {
    return onFormSave(mapValuesToNumber(data));
  };

  // TODO - How should we handle hidden fields? e.g. at end of questionnaire
  const onStep = (stepSize: number) => {
    // Set bounds on the new step index
    let newStepIdx = Math.min(
      Math.max(0, currentStepIdx + stepSize),
      steps.length - 1,
    );
    if (stepSize < 0) {
      // Go back until fields are no longer hidden
    }
    setFadeOffset(`${stepSize}rem`);
    setCurrentStepIdx(newStepIdx);
    clearErrors(currentStepIdx.toString());
  };

  // Render the current question
  const currentStep: Step = steps[currentStepIdx];
  // TODO: Should probably be displaying a loading screen
  if (!currentStep) return <div></div>;

  // Check whether the current step is in a valid state
  const isStepValid: boolean = !currentStep.fields.some((field) => {
    return (
      (field.type !== 'hidden' && getValues(field.name) === undefined) ||
      getFieldState(field.name, formState).invalid
    );
  });

  const isGroup = currentStep.fields.length > 1;



  const renderFields = () => {
    const fields = currentStep.fields
      .map((field) => {
        switch (field.type) {
          case 'checkbox':
          case 'decimal':
          case 'dropdown':
          case 'radio':
          case 'text':
            const InputComponent = STANDALONE_INPUT_MAP[field.type];


            return (
              <QuestionnaireField
                compact={isGroup}
                description={field.description}
                id={field.name}
                key={field.name}
                label={field.text}
              >
                <InputComponent
                  compact={isGroup}
                  control={control}
                  id={field.name}
                  field={field}
                  register={register}
                />
              </QuestionnaireField>
            );
          case 'hidden':
            // TODO
            //setValue(field.name, field.state);
            return <div key={field.name}>Not implemented yet</div>;
          default:
            console.error(`Invalid type of ${field.type}`);
            return null;
        }
      })
      .filter(Boolean);
    if (!fields.length) setCurrentStepIdx(currentStepIdx + 1);
    return fields;
  };

  return (
    <Center minHeight="50vh" my="1.5rem">
      <Container p="0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <SlideFade in key={currentStep.name} offsetX={fadeOffset} offsetY="0">
            <Container mb="1" px="0" py="4" rounded="lg">
              {currentStep.text && (
                <Text fontSize={isGroup ? '2xl' : '3xl'}>
                  {currentStep.text}
                </Text>
              )}
              {currentStep.description && (
                <Text fontSize="md">{currentStep.description}</Text>
              )}
              {renderFields()}
              {errors[currentStep.name] && <span>All fields are required</span>}
            </Container>
          </SlideFade>
          <Box w="55%" py="4">
            <Progress
              aria-label="Completion %"
              colorScheme="teal"
              size="sm"
              value={(currentStepIdx / (steps.length - 1)) * 100}
            />
          </Box>
          <ButtonGroup spacing="1rem">
            {currentStepIdx > 0 && (
              <Button onClick={() => onStep(-1)} type="button" variant="solid">
                Previous
              </Button>
            )}
            {currentStepIdx < steps.length - 1 && (
              <Button
                colorScheme="teal"
                isDisabled={!isStepValid}
                onClick={() => onStep(1)}
                type="button"
                variant="solid"
              >
                Next
              </Button>
            )}
            <Button
              colorScheme="teal"
              onClick={handleSubmit(onSave)}
              type="button"
              variant="link"
            >
              Save and quit
            </Button>
            {currentStepIdx === steps.length - 1 && (
              <Button
                colorScheme="teal"
                isDisabled={!isFormValid}
                type="submit"
                variant="solid"
              >
                Submit Responses
              </Button>
            )}
          </ButtonGroup>
        </form>
      </Container>
    </Center>
  );
};
