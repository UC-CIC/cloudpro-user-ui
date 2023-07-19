import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Center, Container, Stack } from '@chakra-ui/react';

import Loader from '../components/Loader/Loader';
import { PageLayout } from '../components/page-layout';
import { QuestionnaireCheckboxes } from '../components/QuestionnaireForm/QuestionnaireCheckboxes';
import { QuestionnaireDropdown } from '../components/QuestionnaireForm/QuestionnaireDropdown';
import { QuestionnaireField } from '../components/QuestionnaireForm/QuestionnaireField';
import { QuesitonnaireNumberInput } from '../components/QuestionnaireForm/QuesitonnaireNumberInput';
import { QuestionnaireRadio } from '../components/QuestionnaireForm/QuestionnaireRadio';
import { QuestionnaireTextInput } from '../components/QuestionnaireForm/QuestionnaireTextInput';
import { useAuth } from '../hooks/useAuth';
import {
  Audit as AuditType,
  FormState,
  QuestionData,
  QuestionGroupData,
} from '../models/form-state';
import {
  getAudit,
  getQuestionnaireByProHash,
} from '../services/message.service';
import { mapValues } from '../utils';

interface Field {
  name: string;
  description?: string | undefined;
  text: string;
  type: string;
  value?: any;
  state?: any;
}

interface FormElement {
  name: string;
  description?: string;
  text?: string;
  fields: Field[];
}

interface FormData {
  [key: string]: {
    [link_id: string]: string | number;
  };
}

const STANDALONE_INPUT_MAP = {
  checkbox: QuestionnaireCheckboxes,
  decimal: QuesitonnaireNumberInput,
  dropdown: QuestionnaireDropdown,
  hidden: QuestionnaireTextInput,
  radio: QuestionnaireRadio,
  text: QuestionnaireTextInput,
};

const BUILD_FORM_MAP: {
  [key: string]: (name: string, data: any, formState: FormState) => FormElement;
} = {
  group: (
    name: string,
    data: QuestionGroupData,
    formState: FormState,
  ): FormElement => {
    return {
      name,
      description: data.description || '',
      text: data.text || '',
      fields: data.questions.map((question) => ({
        name: `${name}.${question.linkId}`,
        text: question.text,
        type: question.type,
        value:
          question.value ||
          (data.values || {})[question.useValues || ''] ||
          data.value,
        state: formState.states[question.linkId || '']?.entryResponse,
      })),
    };
  },
  question: (
    name: string,
    data: QuestionData,
    formState: FormState,
  ): FormElement => ({
    name,
    fields: [
      {
        name: `${name}.${data.linkId}`,
        ...data,
        state: formState.states[data.linkId || '']?.entryResponse,
      },
    ],
  }),
};

// Helper method to force values into strings. This is necessary to bypass a
// Chakra UI bug with checkboxes regarding numbers (particularly with the 0
// value).
const mapValuesToString = (val: any): any =>
  mapValues(val, (v: any) => v?.toString());

export const Audit: React.FC = () => {
  const auth = useAuth();
  const { sid = '' } = useParams();

  const { control, register, setValue } = useForm<FormData>({
    mode: 'onChange',
  });

  // Get audit payload
  const { data: auditData, isLoading: isLoadingAudit } = useQuery<AuditType>(
    ['audit', sid],
    async () => {
      if (!sid) throw new Error('SID must be specified');
      const token = await auth.getAccessToken();
      const { data, error } = await getAudit(token, sid);
      if (!data || error) throw error || new Error('Could not retrieve audit');
      return data;
    },
  );

  const proPack = auditData?.state?.proPack;
  const auditState = auditData?.state;

  // Retrieve the questionnaire; depend on existance of proPack
  const {
    data: questionnaire,
    isError: isLoadingQuestionnaireError,
    isLoading: isLoadingQuestionnaire,
  } = useQuery({
    queryKey: ['questionnaire', proPack],
    queryFn: async () => {
      if (!proPack) return;
      const authToken = await auth.getAccessToken();
      const { data, error } = await getQuestionnaireByProHash(
        proPack,
        authToken,
      );
      if (!data && error) throw new Error('Could not retrieve questionnaire');
      return data;
    },
    enabled: !!proPack,
  });

  // Setup form
  const proFormQuestions: FormElement[] = useMemo(() => {
    const elements: FormElement[] = [];
    if (!auditState || !questionnaire) return elements;
    questionnaire.data.questionnaire.forEach((metadata: any, idx: number) => {
      const createElement = BUILD_FORM_MAP[metadata.element];
      if (createElement)
        elements.push(createElement(idx.toString(), metadata.data, auditState));
    });
    return elements;
  }, [auditState, questionnaire]);

  // Set form values
  useEffect(() => {
    if (!proFormQuestions || !auditState) return;
    for (const step of proFormQuestions) {
      for (const field of step.fields) {
        const linkId = field.name.split('.')[1];
        const entryResponse = auditState.states[linkId].entryResponse;
        setValue(field.name, mapValuesToString(entryResponse));
      }
    }
  }, [auditState, proFormQuestions, setValue]);

  const renderFields = (step: FormElement) => {
    const isGroup = step.fields.length > 1;
    return step.fields.map((field) => {
      switch (field.type) {
        case 'checkbox':
        case 'decimal':
        case 'dropdown':
        case 'hidden':
        case 'radio':
        case 'text':
          const InputComponent = STANDALONE_INPUT_MAP[field.type];
          return (
            <QuestionnaireField
              compact={isGroup}
              description={field.description}
              disabled
              key={field.name}
              id={field.name}
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
        default:
          console.error(`Invalid type of ${field.type}`);
          return null;
      }
    });
  };

  if (isLoadingAudit || isLoadingQuestionnaire) {
    return (
      <Stack mt="32" align="center">
        <Loader />
      </Stack>
    );
  }

  return (
    <PageLayout>
      <Container maxW="3xl">
        { proFormQuestions.length != 0 ?
              proFormQuestions.map((step) => (
                <Box
                  key={step.name}
                  mb="4"
                  py="4"
                  px="6"
                  borderRadius="md"
                  bg="gray.50"
                >
                  {renderFields(step)}
                </Box>
              )) : 
              <Box
                  mb="4"
                  py="4"
                  px="6"
                  borderRadius="md"
                  bg="gray.50"
                >
                  Woops! You missed this survey. It is important to remember to complete your assigned surveys to better help your care team.
                </Box>
        }

        <Center mt="8">
          <Button as={Link} colorScheme="teal" to="/home">
            Go back to surveys
          </Button>
        </Center>
      </Container>
    </PageLayout>
  );
};
