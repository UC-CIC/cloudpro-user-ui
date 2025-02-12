import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Input, InputGroup, Box, Select } from '@chakra-ui/react';

import PatientProfileFormControls from './PatientProfileFormControls';
import FormControl from '../../components/FormControl';
import ComboBox from '../../components/ComboBox';
import { useAuth } from '../../hooks/useAuth';
import {
  getHospitalByHid,
  getHospitalList,
  PatientProfile,
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

const PHONE_FORMAT = /^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

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

  // Submit data before changing screen
  const handleStepChange = (stepSize: number) => {
    onSubmit(getValues());
    onStepChange(stepSize);
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
        <Input
          id="phone"
          type="tel"
          placeholder="xxx-xxx-xxxx"
          {...register('phone', {
            required: 'Phone is required',
            pattern: {
              value: PHONE_FORMAT,
              message: 'Invalid phone number',
            },
          })}
        />
      </FormControl>

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
        isFormValid={isValid}
        onStepChange={handleStepChange}
      />
    </form>
  );
};

export default PatientProfileBase;
