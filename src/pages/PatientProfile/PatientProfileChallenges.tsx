import React from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select } from '@chakra-ui/react';

import PatientProfileFormControls from './PatientProfileFormControls';
import FormControl from '../../components/FormControl';

export type FormData = {
  c1q: string;
  c1a: string;
  c2q: string;
  c2a: string;
  c3q: string;
  c3a: string;
};

export interface Props {
  initialValues: FormData;
  onStepChange: (stepSize: number) => any;
  onSubmit: (data: FormData) => any;
}

const PatientProfileChallenges: React.FC<Props> = ({
  initialValues,
  onStepChange,
  onSubmit,
}) => {
  // Setup form
  const {
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    register,
  } = useForm<FormData>({ defaultValues: initialValues, mode: 'onTouched' });

  const challengeOptions = [
    { value: 'a', text: 'What is your favorite name?' },
    { value: 'b', text: 'What is your favorite website?' },
    { value: 'c', text: 'What is your favorite game?' },
  ];

  // Submit data before changing screen
  const handleStepChange = (stepSize: number) => {
    onSubmit(getValues());
    onStepChange(stepSize);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Challenge question q1 */}
      <FormControl error={errors.c1q?.message as string} label="Challenge Q1">
        <Select
          id="c1q"
          placeholder="Select option"
          {...register('c1q', {
            required: 'Please select your first challenge question',
          })}
        >
          {challengeOptions.map((challenge) => (
            <option style={{ backgroundColor: 'white'}} key={challenge.value} value={`c1q_${challenge.value}`}>
              {challenge.text}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Challenge question q1 answer */}
      <FormControl error={errors.c1a?.message as string} label="Q1 Answer">
        <Input
          id="c1a"
          type="text"
          {...register('c1a', { required: 'Please provide an answer.' })}
        />
      </FormControl>

      {/* Challenge question q2 */}
      <FormControl error={errors.c2q?.message as string} label="Challenge Q2">
        <Select
          id="c2q"
          placeholder="Select option"
          {...register('c2q', {
            required: 'Please select your second challenge question',
          })}
        >
          {challengeOptions.map((challenge) => (
            <option style={{ backgroundColor: 'white'}} key={challenge.value} value={`c2q_${challenge.value}`}>
              {challenge.text}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Challenge question q2 answer */}
      <FormControl error={errors.c2a?.message as string} label="Q2 Answer">
        <Input
          id="c2a"
          type="text"
          {...register('c2a', { required: 'Please provide an answer.' })}
        />
      </FormControl>

      {/* Challenge question q3 */}
      <FormControl error={errors.c3q?.message as string} label="Challenge Q3">
        <Select
          id="c3q"
          placeholder="Select option"
          {...register('c3q', {
            required: 'Please select your third challenge question',
          })}
        >
          {challengeOptions.map((challenge) => (
            <option style={{ backgroundColor: 'white'}} key={challenge.value} value={`c3q_${challenge.value}`}>
              {challenge.text}
            </option>
          ))}
        </Select>
      </FormControl>

      {/* Challenge question q3 answer */}
      <FormControl error={errors.c3a?.message as string} label="Q3 Answer">
        <Input
          id="c3a"
          type="text"
          {...register('c3a', { required: 'Please provide an answer.' })}
        />
      </FormControl>

      {/* Form controls */}
      <PatientProfileFormControls
        isFormValid={isValid}
        onStepChange={handleStepChange}
      />
    </form>
  );
};

export default PatientProfileChallenges;
