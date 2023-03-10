import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PageLayout } from '../components/page-layout';
import { QuestionnaireForm } from '../components/QuestionnaireForm/QuestionnaireForm';
import { useAuth } from '../hooks/useAuth';
import { FormState } from '../models/form-state';
import {
  getStateByStateHash,
  getQuestionnaireByProHash,
  updateFullState,
} from '../services/message.service';

interface QuestionData {
  [key: string]: any;
}

interface FormElement {
  name: string;
  description?: string;
  text?: string;
  fields: {
    name: string;
    text: string;
    type: string;
    value: any;
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
  group: (name: string, data: any, formState: FormState): FormElement => {
    return {
      name,
      description: data.description || '',
      text: data.text || '',
      fields: Object.values(data.questions as QuestionData).map((groupVal) => ({
        name: `${name}.${groupVal.link_id}`,
        text: groupVal.text,
        type: groupVal.type,
        value:
          groupVal.value ||
          (data.values || {})[groupVal.use_values] ||
          data.value,
        state: formState.states[groupVal.link_id]?.entry_response,
      })),
    };
  },
  question: (name: string, data: any, formState: FormState): FormElement => ({
    name,
    fields: [
      {
        name: `${name}.${data.link_id}`,
        ...data,
        state: formState.states[data.link_id]?.entry_response,
      },
    ],
  }),
};

const buildForm = (
  formState: FormState,
  questionnaire: { [key: string]: any } | null,
): FormElement[] => {
  const elements: FormElement[] = [];
  if (!formState || !questionnaire) return elements;
  const questionData: QuestionData = questionnaire.data.questionnaire;
  questionData.forEach((metadata: any, idx: number) => {
    const createElement = BUILD_FORM_MAP[metadata.element];
    if (createElement)
      elements.push(createElement(idx.toString(), metadata.data, formState));
  });
  return elements;
};

export const Questionnaire: React.FC = () => {
  const auth = useAuth();
  const { stateHash } = useParams();

  const [proFormQuestions, setproFormQuestions] = useState<FormElement[]>([]);

  const [proFormState, setproFormState] = useState<FormState>({
    state_status: '',
    state_hash: '',
    pro_pack: '',
    states: {
      '': {
        entry_response: '',
        nxt: '',
        entry_state: '',
        prev: '',
      },
    },
  });

  useEffect(() => {
    const setupQuestionnaire = async () => {
      // TODO: REDIRECT?
      if (!stateHash) return;
      const token = await auth.getAccessToken();
      // Retrieve the PRO state
      const { data: proState, error: stateError } = await getStateByStateHash(
        stateHash,
        token,
      );
      // TODO: REDIRECT/THROW ERROR?
      if (!proState || !proState.pro_pack) return;
      setproFormState(proState as FormState);
      // Retrive the questionnaire
      const { data: questionnaire, error: questionnaireError } =
        await getQuestionnaireByProHash(proState.pro_pack, token);
      setproFormQuestions(buildForm(proState as any, questionnaire));
    };

    setupQuestionnaire();
  }, [stateHash]);

  const putUpdateFullState = async (state: FormState) => {
    let token = await auth.getAccessToken();
    const { data, error } = await updateFullState(state, token);
    return data;
  };

  const saveState = (data: FormData) => {
    const formState = { ...proFormState, states: { ...proFormState.states } };
    const questions = [...proFormQuestions];

    for (const [idx, formEntry] of Object.entries(data)) {
      const question = { ...questions[Number(idx)] };
      for (let [linkId, stateValue] of Object.entries(formEntry)) {
        formState.states[linkId] = {
          ...formState.states[linkId],
          entry_response: stateValue,
          entry_state: 'updated',
        };
        const fieldIdx = question.fields.findIndex(
          (field) => field.name === `${idx}.${linkId}`,
        );
        question.fields[fieldIdx] = {
          ...question.fields[fieldIdx],
          state: stateValue,
        };
      }
      questions[Number(idx)] = question;
    }
    setproFormQuestions(questions);
    setproFormState(formState);
    putUpdateFullState(formState);
  };

  return (
    <PageLayout>
      <QuestionnaireForm saveState={saveState} steps={proFormQuestions} />
    </PageLayout>
  );
};
