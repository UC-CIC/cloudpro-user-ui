import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Link as ChakraLink,
  ScaleFade,
  Stack,
  Text,
} from '@chakra-ui/react';

import Loader from '../components/Loader/Loader';
import { QuestionnaireForm } from '../components/QuestionnaireForm/QuestionnaireForm';
import { PageLayout } from '../components/page-layout';
import { useAuth } from '../hooks/useAuth';
import {
  FormState,
  QuestionData,
  QuestionGroupData,
  Questionnaire,
} from '../models/form-state';
import {
  getStateByStateHash,
  getQuestionnaireByProHash,
  initState,
  updateFullState,
} from '../services/message.service';

interface FormElement {
  name: string;
  description?: string;
  text?: string;
  fields: {
    name: string;
    text: string;
    type: string;
    value?: any;
    state?: any;
  }[];
}

interface FormData {
  [key: string]: {
    [link_id: string]: string | number;
  };
}

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

const buildForm = (
  formState: FormState | null | undefined,
  questionnaire: Questionnaire | null | undefined,
): FormElement[] => {
  const elements: FormElement[] = [];
  if (!formState || !questionnaire) return elements;
  questionnaire.data.questionnaire.forEach((metadata: any, idx: number) => {
    const createElement = BUILD_FORM_MAP[metadata.element];
    if (createElement)
      elements.push(createElement(idx.toString(), metadata.data, formState));
  });
  return elements;
};

export const Survey: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { propack = '', stateHash = '' } = useParams();

  const [formState, setFormState] = useState<FormState | undefined>();

  // Retrieve (or initialize) the form state and set locally
  const { isError: isLoadingStateError, isLoading: isLoadingState } =
    useQuery<FormState>(
      ['survey-state', propack, stateHash],
      async () => {
        if (!propack || !stateHash)
          throw new Error('Pro pack and state hash IDs must be specified');

        const token = await auth.getAccessToken();
        const { data: state, error } = await getStateByStateHash(
          stateHash,
          token,
        );
        if (error) throw new Error('Could not retrieve state');

        // Return pre-existing state
        if (state && state.stateHash) return state;

        // Initialize state
        const { data: newState } = await initState(propack, stateHash, token);
        if (!newState) throw new Error('Could not initialize state');
        return newState;
      },
      { onSuccess: (data: FormState) => setFormState(data) },
    );

  // Retrieve the questionnaire
  const {
    data: questionnaire,
    isError: isLoadingQuestionnaireError,
    isLoading: isLoadingQuestionnaire,
  } = useQuery(['questionnaire', propack], async () => {
    const authToken = await auth.getAccessToken();
    const { data, error } = await getQuestionnaireByProHash(propack, authToken);
    if (!data && error) throw new Error('Could not retrieve questionnaire');
    return data;
  });

  // Form update method
  const {
    isLoading: isSubmitting,
    isSuccess: isSubmitted,
    mutate: updateState,
  } = useMutation({
    mutationFn: async (state: FormState) => {
      const authToken = await auth.getAccessToken();
      const { data, error } = await updateFullState(state, authToken);
      if (!data && error) throw error;
      return data;
    },
  });

  // Setup form
  const proFormQuestions: FormElement[] = useMemo(() => {
    return buildForm(formState, questionnaire);
  }, [formState, questionnaire]);

  const saveState = async (data: FormData) => {
    if (!formState) return;
    const newState = { ...formState, states: { ...formState.states } };
    // Update local state
    for (const formEntry of Object.values(data)) {
      for (const [linkId, stateValue] of Object.entries(formEntry)) {
        newState.states[linkId] = {
          ...newState.states[linkId],
          entryResponse: stateValue,
          entryState: 'updated',
        };
      }
    }
    setFormState(newState);
    // Save state to DB
    return updateState(newState);
  };

  const handleFormSave = async (formDate: FormData) => {
    await saveState(formDate);
    navigate('/home');
  };

  const handleFormSubmit = async (formDate: FormData) => saveState(formDate);

  const isLoading = isLoadingState || isLoadingQuestionnaire || isSubmitting;
  const isError = isLoadingStateError || isLoadingQuestionnaireError;

  return (
    <PageLayout>
      <Container maxW="5xl">
        {isLoading || isError || isSubmitted ? (
          <Stack
            justifyContent="center"
            align="center"
            textAlign="center"
            minHeight="50vh"
          >
            <Container maxW="lg">
              {isLoading && (
                <ScaleFade in initialScale={0.9}>
                  <Loader />
                </ScaleFade>
              )}
              {isSubmitted && (
                <>
                  <Text fontSize="xl" mb="2">
                    Thank you, your survey has been submitted for your surgeon's
                    review.
                  </Text>
                  <Text fontWeight="normal" mb="4">
                    Click below to finish and see your remaining surveys.
                  </Text>
                  <ChakraLink as={Link} color="teal" to="/home">
                    Go to survey list
                  </ChakraLink>
                </>
              )}
              {isError && (
                <>
                  <Text fontSize="xl" mb="2">
                    Your survey could not be loaded at this time.
                  </Text>
                  <Text fontWeight="normal" mb="4">
                    Please refresh this page in a few seconds to try again or
                    click below to see all your available surveys.
                  </Text>
                  <ChakraLink as={Link} color="teal" to="/home">
                    Go back to survey list
                  </ChakraLink>
                </>
              )}
            </Container>
          </Stack>
        ) : (
          <QuestionnaireForm
            onFormSave={handleFormSave}
            onFormSubmit={handleFormSubmit}
            steps={proFormQuestions}
          />
        )}
      </Container>
    </PageLayout>
  );
};
