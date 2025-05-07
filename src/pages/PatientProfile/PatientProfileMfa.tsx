import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Select, Text, Input } from '@chakra-ui/react';

import PatientProfileFormControls from './PatientProfileFormControls';
import FormControl from '../../components/FormControl';
import { loginForPhoneNo } from '../../services/message.service';

type FormData = { tfa: string; email: string };

export interface Props {
  initialValues: FormData;
  onStepChange: (stepSize: number) => any;
  onSubmit: (data: FormData) => any;
}

const PatientProfileMfa: React.FC<Props> = ({
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
    watch
  } = useForm<FormData>({ defaultValues: initialValues, mode: 'onTouched' });

  const tfa = watch('tfa');
  const email = watch('email'); 
  console.log(tfa );

  // Submit data before changing screen
  const handleStepChange = async (stepSize: number) => {
    const payload = {
      otp_method: tfa,
      email: email,
    };
    await loginForPhoneNo(payload);
    onSubmit(getValues());
    onStepChange(stepSize);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        fontSize="sm"
        fontWeight="medium"
        pt={4}
        pb={6}
        textAlign="left"
        maxWidth="xl"
      >
        <Text mb="4">
          CloudPRO simplifies your life by defaulting to passwordless
          authentication. This allows for a unique code to be sent to you each
          time you login to identify you.
        </Text>
        <Text>
          We support three methods of this code being sent, email, SMS, or a
          phone call. Let us know your default preference!
        </Text>
      </Box>

      {/* Email input */}
      <FormControl error={errors.email?.message as string} label="Email">
        <Input
          type="email"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Please enter your email.',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Please enter a valid email address.',
            },
          })}
        />
      </FormControl>

      {/* tfa selection */}
      <FormControl error={errors.tfa?.message as string} label="Preferred Two Factor Authentication">
        <Select
          placeholder="Select option"
          {...register('tfa', {
            required: 'Please select a default two factor device.',
          })}
        >
          <option style={{ backgroundColor: 'white' }} value="email">Email</option>
          <option style={{ backgroundColor: 'white' }} value="sms">
            SMS
          </option>
          {/* <option style={{ backgroundColor: 'white' }} value="call" disabled>
            Call
          </option> */}
        </Select>
      </FormControl>

      {/* Form controls */}
      <PatientProfileFormControls
        isFormValid={isValid}
        onStepChange={handleStepChange}
      />
    </form>
  );
};

export default PatientProfileMfa;
