import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Input, InputGroup, Box, Select, Button, InputRightElement } from '@chakra-ui/react';

import PatientProfileFormControls from './PatientProfileFormControls';
import FormControl from '../../components/FormControl';
import ComboBox from '../../components/ComboBox';
import { useAuth } from '../../hooks/useAuth';
import {
  getHospitalByHid,
  getHospitalList,
  PatientProfile,
  sendOptForPatient,
  otpVerificationForPatient,
} from '../../services/message.service';

type FormData = PatientProfile['profile'];

export interface Props {
  initialValues: FormData;
  onStepChange: (stepSize: number) => any;
  onSubmit: (data: FormData) => any;
}

interface HospitalEntity {
  hid: string;
  hospitalName: string;
  surgeons?: SurgeonEntity[];
}

interface SurgeonEntity {
  name: string;
  sub: string;
}

const PHONE_FORMAT = /^\+\d{1,3}[-\s.]?\(?\d{3}\)?[-\s.]?\d{3}[-\s.]?\d{4,6}$/;

const PatientProfileBase: React.FC<Props> = ({
  initialValues,
  onStepChange,
  onSubmit,
}) => {
  const auth = useAuth();

  // Setup form
  const {
    control,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>({ defaultValues: initialValues, mode: 'onTouched' });
  const selectedHid = (watch('hospital') || '').split(';')[0];
  const phoneValue = watch('phone');
  const OTP = watch('otp')

  // Query for hospitals
  const { data: hospitals, isLoading: isLoadingHospitals } = useQuery(
    'hospitals',
    async () => {
      const token = await auth.getAccessToken();
      const { data, error } = await getHospitalList(token);
      if (!data && error) throw error;
      return data as HospitalEntity[];
    },
  );

  const hospitalsList = useMemo(() => {
    return (hospitals || []).map(({ hid, hospitalName }) => ({
      label: hospitalName,
      value: `${hid};${hospitalName}`,
    }));
  }, [hospitals]);

  // Query for surgeons
  const { data: surgeons, isLoading: isLoadingSurgeons } = useQuery(
    ['surgeons', selectedHid],
    async () => {
      const token = await auth.getAccessToken();
      const { data, error } = await getHospitalByHid(selectedHid, token);
      if (!data && error) throw error;
      return (data || {}).surgeons as SurgeonEntity[];
    },
    { enabled: !!selectedHid },
  );

  const surgeonsList = useMemo(() => {
    return (surgeons || []).map(({ sub, name }) => ({
      label: name,
      value: `${sub};${name}`,
    }));
  }, [surgeons]);

  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const isPhoneValid = PHONE_FORMAT.test(phoneValue);

  const sendOTP = async () => {
    try {
        const token = await auth.getAccessToken();
        const { data, error } = await sendOptForPatient(token, phoneValue);
        if (data){
          setShowOTPInput(true);
          setIsOTPVerified(false);
          alert(data)
        }else{
          alert(error?.message)
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

  const otpVerification = async() => {
    try {
      const token = await auth.getAccessToken();
      const payload = {
        phone: phoneValue,
        otp : OTP,
        email : auth.username
      }
      const { data, error } = await otpVerificationForPatient(token, payload);
      if (data){
        setIsOTPVerified(true);
        alert(data)
      }else{
        alert(error?.message)
      }
  } catch (error) {
      console.error(error);
      throw error;
  }
  };

  const handleStepChange = (stepSize: number) => {
    if (isOTPVerified) {
      onSubmit(getValues());
      onStepChange(stepSize);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <FormControl label="Email">
        <Input id="username" type="text" disabled value={auth.username} />
      </FormControl>

      {/* First name */}
      <FormControl
        error={errors.firstName?.message as string}
        label="First Name"
      >
        <Input
          id="firstName"
          type="text"
          {...register('firstName', { required: 'First name is required' })}
        />
      </FormControl>

      {/* Last name */}
      <FormControl error={errors.lastName?.message as string} label="Last Name">
        <Input
          id="lastName"
          type="text"
          {...register('lastName', { required: 'Last name is required' })}
        />
      </FormControl>

      <InputGroup>
        {/* Birth date */}
        <FormControl
          error={errors.birthDate?.message as string}
          label="Birth Date"
        >
          <Input
            id="birthDate"
            type="date"
            {...register('birthDate', { required: 'Birth date is required' })}
          />
        </FormControl>

        <Box width="8" />

        {/* Birth sex */}
        <FormControl
          error={errors.birthSex?.message as string}
          label="Birth Sex"
        >
          <Select
            id="birthSex"
            bg="white"
            placeholder="Select option"
            {...register('birthSex', { required: 'Birth sex is required' })}
          >
            <option style={{ backgroundColor: 'white' }} value="bs_m">
              Male
            </option>
            <option style={{ backgroundColor: 'white' }} value="bs_f">
              Female
            </option>
          </Select>
        </FormControl>
      </InputGroup>

      {/* Phone */}
      <FormControl error={errors.phone?.message as string} label="Phone">
      <InputGroup>
        <Input
          id="phone"
          type="tel"
          placeholder="+1-xxx-xxx-xxxx"
          {...register('phone', {
            required: 'Phone number with country code is required',
            pattern: {
              value: PHONE_FORMAT,
              message: 'Invalid phone number. Must include country code.',
            },
          })}
        />

          {isPhoneValid && (
            <InputRightElement width="auto">
              <Button onClick={sendOTP} type="button" h="1.75rem" size="sm" mr="2">
                Send OTP
              </Button>
            </InputRightElement>
          )}
        </InputGroup>
      </FormControl>

      {/* Phone OTP */}
      {showOTPInput && isPhoneValid && (
        <FormControl error={errors?.otp?.message as string}>
          <InputGroup>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP = One Time Password"
              {...register('otp', {
                required: 'OTP = One Time Password is required',
              })}
            />
            <InputRightElement width="auto">
              <Button onClick={otpVerification} h="1.75rem" size="sm" mr="2">
                Verify OTP
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      )}

      {/* Hospital */}
      <FormControl error={errors.hospital?.message as string} label="Hospital">
        <Controller
          control={control}
          name="hospital"
          render={({ field: fieldProps }) => (
            <ComboBox
              disabled={isLoadingHospitals || isLoadingSurgeons}
              options={hospitalsList}
              placeholder={
                isLoadingHospitals ? 'Loading...' : 'Select hospital'
              }
              {...fieldProps}
              onChange={(value) => fieldProps.onChange(value.value)}
            />
          )}
          rules={{ required: 'Hospital is required' }}
        />
      </FormControl>

      {/* Surgeon */}
      <FormControl error={errors.surgeon?.message as string} label="Surgeon">
        <Controller
          control={control}
          name="surgeon"
          render={({ field: fieldProps }) => (
            <ComboBox
              disabled={!surgeonsList?.length || isLoadingSurgeons}
              options={surgeonsList}
              placeholder="Select surgeon"
              {...fieldProps}
              onChange={(value) => fieldProps.onChange(value?.value ?? null)}
            />
          )}
          rules={{ required: 'Surgeon is required' }}
        />
      </FormControl>

      {/* {procedure} */}
      <FormControl error={errors.surgery_name?.message as string} label="Procedure">
        <Select
          id="surgery_name"
          placeholder="Select procedure"
          {...register('surgery_name', { required: 'Procedure is required' })}
        >
          <option value="Lung cancer resection">Lung cancer resection</option>
          <option value="Esophageal cancer resection">Esophageal cancer resection</option>
        </Select>
      </FormControl>
      
      {/* Surgery date */}
      <FormControl
        error={errors.surgeryDate?.message as string}
        id="surgeryDate"
        label="Surgery Date"
      >
        <Input
          type="date"
          {...register('surgeryDate', { required: 'Surgery date is required' })}
        />
      </FormControl>

      {/* Form controls */}
      <PatientProfileFormControls
        isFirstStep
        isFormValid={isValid && isOTPVerified}
        onStepChange={handleStepChange}
      />
    </form>
  );
};

export default PatientProfileBase;
