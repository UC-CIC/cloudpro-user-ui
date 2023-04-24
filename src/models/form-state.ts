export interface FormState {
  stateStatus: string;
  stateHash: string;
  proPack: string;
  states: {
    [key: string]: {
      entryResponse: any;
      nxt: string | undefined;
      entryState: string;
      prev: string | undefined;
    };
  };
}

export interface QuestionnaireMetadata {
  name: string;
  format: string;
  description: string;
  version: string;
}

export interface Question<T = QuestionData | QuestionGroupData> {
  element: 'question' | 'group';
  data: T;
}

export interface BaseQuestion {
  description?: string;
  linkId?: string;
  scale?: string;
  text: string;
  useValues?: string;
  value?: any;
}

export interface QuestionData extends BaseQuestion {
  scale?: string;
  type: string;
  useValues?: string;
  value?: any;
}

export interface QuestionGroupData extends BaseQuestion {
  name: string;
  questions: QuestionData[];
  values: {
    [key: string]: { text: string; type: string; value: any }[];
  };
}

export interface Questionnaire {
  proPack: string;
  proPackFormat: string;
  data: {
    metadata: QuestionnaireMetadata;
    questionnaire: Question[];
  };
}
