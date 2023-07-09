import React, { useMemo } from 'react';
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
} from '../models/form-state';
import {
  closeSurvey,
  evaluateScore,
  getStateByStateHash,
  getQuestionnaireByProHash,
  initState,
  updateFullState,
} from '../services/message.service';

interface FormElementField {
  name: string;
  linkId?: string;
  text: string;
  type: string;
  value?: any;
  state?: any;
}

interface FormElement {
  name: string;
  description?: string;
  text?: string;
  fields: FormElementField[];
  hiddenFields: FormElementField[];
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
    const fields: FormElementField[] = [];
    const hiddenFields: FormElementField[] = [];
    data.questions.forEach((question) => {
      (question.type === 'hidden' ? hiddenFields : fields).push({
        linkId: question.linkId,
        name: `${name}.${question.linkId}`,
        text: question.text,
        type: question.type,
        value:
          question.value ||
          (data.values || {})[question.useValues || ''] ||
          data.value,
        state: formState.states[question.linkId || '']?.entryResponse,
      });
    });
    return {
      name,
      description: data.description || '',
      text: data.text || '',
      fields,
      hiddenFields,
    };
  },
  question: (
    name: string,
    data: QuestionData,
    formState: FormState,
  ): FormElement => {
    const fields: FormElementField[] = [];
    const hiddenFields: FormElementField[] = [];
    (data.type === 'hidden' ? hiddenFields : fields).push({
      linkId: data.linkId,
      name: `${name}.${data.linkId}`,
      ...data,
      state: formState.states[data.linkId || '']?.entryResponse,
    });
    return { name, fields, hiddenFields };
  },
};

const updateFormStateStates = (state: FormState['states'], data: FormData) => {
  const newState: FormState['states'] = { ...state };
  // Update local state
  for (const formEntry of Object.values(data)) {
    for (const [linkId, stateValue] of Object.entries(formEntry)) {
      newState[linkId] = {
        ...newState[linkId],
        entryResponse: stateValue,
        entryState: 'updated',
      };
    }
  }
  return newState;
};

export const Survey: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { propack = '', stateHash = '' } = useParams();

  // Retrieve (or initialize) the form state and set locally
  const {
    data: formState,
    isError: isLoadingStateError,
    isFetching: isLoadingState,
  } = useQuery<FormState>({
    queryKey: ['survey-state', propack, stateHash],
    queryFn: async () => {
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
      console.log(newState);
      if (!newState) throw new Error('Could not initialize state');
      return newState;
    },
    refetchOnMount: 'always',
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

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
  const { isLoading: isUpdating, mutate: updateState } = useMutation({
    mutationFn: async (state: FormState) => {
      const authToken = await auth.getAccessToken();
      const { data, error } = await updateFullState(state, authToken);
      if (!data && error) throw error;
      return data;
    },
    onSuccess: () => navigate('/home'),
  });

  // Form submit method
  const {
    isError: isFormDoneError,
    isLoading: isSubmitting,
    isSuccess: isSubmitted,
    mutate: submit,
  } = useMutation({
    mutationFn: async ({
      formState,
      hiddenIds,
      proPack,
      proPackFormat,
    }: {
      formState: FormState;
      hiddenIds: string[];
      proPack: string;
      proPackFormat: string;
    }) => {
      const authToken = await auth.getAccessToken();

      // Calculate scores
      const idValuesMap = Object.entries(formState.states).reduce(
        (acc, [linkId, state]) => {
          acc[linkId] = state.entryResponse;
          return acc;
        },
        {} as any,
      );
      const scoredStates = { ...formState.states };
      for (const id of hiddenIds) {
        const { data, error } = await evaluateScore(
          id,
          { data: idValuesMap, proPack, proPackFormat },
          authToken,
        );
        if (!data && error) throw error;
        idValuesMap[id] = data;
        scoredStates[id] = { entryResponse: data, entryState: 'updated' };
      }
      console.log(scoredStates);

      // Save updated state
      const updateResponse = await updateFullState(
        { ...formState, states: scoredStates },
        authToken,
      );
      if (!updateResponse.data && updateResponse.error)
        throw updateResponse.error;

      // Close survey
      const sid = formState.stateHash.substring(0, 64);
      const dueDate = formState.stateHash.substring(64);
      const { data, error } = await closeSurvey(
        auth.sub,
        authToken,
        sid,
        dueDate,
      );
      if (!data && error) throw error;
      return data;
    },
  });

  // Setup form
  const {
    formElements,
    hiddenFields,
  }: { formElements: FormElement[]; hiddenFields: FormElementField[] } =
    useMemo(() => {
      // Initialize arrays
      const elements: FormElement[] = [];
      const hidden: FormElementField[] = [];
      // Return empty arrays if no form state or questionnaire
      if (!formState || !questionnaire)
        return { formElements: elements, hiddenFields: hidden };
      // Generate form elements and hidden fields
      questionnaire.data.questionnaire.forEach((metadata: any, idx: number) => {
        const createElement = BUILD_FORM_MAP[metadata.element];
        if (createElement) {
          const element = createElement(
            idx.toString(),
            metadata.data,
            formState,
          );
          if (element.fields.length) elements.push(element);
          hidden.push(...element.hiddenFields);
        }
      });
      return { formElements: elements, hiddenFields: hidden };
    }, [formState, questionnaire]);

  const handleFormSave = async (formData: FormData) => {
    if (!formState) return;
    return updateState({
      ...formState,
      states: updateFormStateStates(formState.states, formData),
      stateStatus: 'open',
    });
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (!formState || !questionnaire) return;
    const hiddenIds = hiddenFields
      .map((field) => field.linkId)
      .filter(Boolean) as string[];
    const { proPack, proPackFormat } = questionnaire;
    return submit({
      formState: {
        ...formState,
        states: updateFormStateStates(formState.states, formData),
        stateStatus: 'closed',
      },
      hiddenIds,
      proPack,
      proPackFormat,
    });
  };

  const isLoading =
    isLoadingState || isLoadingQuestionnaire || isUpdating || isSubmitting;
  const isError =
    isLoadingStateError || isLoadingQuestionnaireError || isFormDoneError;

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
            steps={formElements}
          />
        )}
      </Container>
    </PageLayout>
  );
};
