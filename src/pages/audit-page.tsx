import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "../components/page-layout";
import Loader from "../components/Loader/Loader";
import { useAuth } from "../hooks/useAuth";
import {
  getAudit,
  getQuestionnaireByProHash,
} from "../services/message.service";
import { useForm } from "react-hook-form";

import { useQuery } from "react-query";
import {
  Container,
  Link as ChakraLink,
  ScaleFade,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  FormState,
  QuestionData,
  QuestionGroupData,
  Questionnaire,
} from "../models/form-state";
import { QuestionnaireCheckboxes } from "../components/QuestionnaireForm/QuestionnaireCheckboxes";
import { QuestionnaireDropdown } from "../components/QuestionnaireForm/QuestionnaireDropdown";
import { QuestionnaireField } from "../components/QuestionnaireForm/QuestionnaireField";
import { QuesitonnaireNumberInput } from "../components/QuestionnaireForm/QuesitonnaireNumberInput";
import { QuestionnaireRadio } from "../components/QuestionnaireForm/QuestionnaireRadio";
import { QuestionnaireTextInput } from "../components/QuestionnaireForm/QuestionnaireTextInput";

export const Audit: React.FC = () => {
  const auth = useAuth();
  const { sid = "" } = useParams();

  //get audit payload
  const { data: auditData, isLoading } = useQuery("getAudit", async () => {
    const token = await auth.getAccessToken();
    const { data, error } = await getAudit(token, sid);
    if (!data && error) throw error;
    return data;
  });

  const proPack: string = auditData?.state.proPack;
  const auditState: FormState = auditData?.state as FormState;

  // Retrieve the questionnaire; depe3nd on existance of proPack
  const {
    data: questionnaire,
    isError: isLoadingQuestionnaireError,
    isLoading: isLoadingQuestionnaire,
  } = useQuery({
    queryKey: "questionnaire",
    queryFn: async () => {
      const authToken = await auth.getAccessToken();
      const { data, error } = await getQuestionnaireByProHash(
        proPack,
        authToken
      );
      if (!data && error) throw new Error("Could not retrieve questionnaire");
      return data;
    },
    enabled: !!proPack,
  });

  ////////////////////////////////////////////////////////////////
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
    [key: string]: (
      name: string,
      data: any,
      formState: FormState
    ) => FormElement;
  } = {
    group: (
      name: string,
      data: QuestionGroupData,
      formState: FormState
    ): FormElement => {
      return {
        name,
        description: data.description || "",
        text: data.text || "",
        fields: data.questions.map((question) => ({
          name: `${name}.${question.linkId}`,
          text: question.text,
          type: question.type,
          value:
            question.value ||
            (data.values || {})[question.useValues || ""] ||
            data.value,
          state: formState.states[question.linkId || ""]?.entryResponse,
        })),
      };
    },
    question: (
      name: string,
      data: QuestionData,
      formState: FormState
    ): FormElement => ({
      name,
      fields: [
        {
          name: `${name}.${data.linkId}`,
          ...data,
          state: formState.states[data.linkId || ""]?.entryResponse,
        },
      ],
    }),
  };

  const buildForm = (
    formState: FormState | null | undefined,
    questionnaire: Questionnaire | null | undefined
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

  // Setup form
  const proFormQuestions: FormElement[] = useMemo(() => {
    return buildForm(auditState, questionnaire);
  }, [auditState, questionnaire]);
  ////////////////////////////////////////////////////////////////

  const STANDALONE_INPUT_MAP = {
    checkbox: QuestionnaireCheckboxes,
    decimal: QuesitonnaireNumberInput,
    dropdown: QuestionnaireDropdown,
    radio: QuestionnaireRadio,
    text: QuestionnaireTextInput,
  };

  interface Field {
    name: string;
    description?: string | undefined;
    text: string;
    type: string;
    value?: any;
    state?: any;
  }
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
  } = useForm<FormData>({ mode: "onTouched" });

  if (isLoading || isLoadingQuestionnaire) {
    return (
      <Stack mt="32" align="center">
        <Loader />
      </Stack>
    );
  }

  const renderFields = () => {
    const builder:any = [];
    for (const step of proFormQuestions) {
      for (const field of step.fields) {
        const descriptor = field as Field;
        switch (field.type) {
          case "checkbox":
          case "decimal":
          case "dropdown":
          case "radio":
          case "text":
            const InputComponent = STANDALONE_INPUT_MAP[field.type];
            const isGroup = step.fields.length > 1;

            builder.push (
              <QuestionnaireField
                compact={isGroup}
                description={descriptor.description}
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
            break;
          case "hidden":
            // TODO
            //setValue(field.name, field.state);
            builder.push( 
                <div key={field.name}>Not implemented yet</div> 
            );
            break;
          default:
            console.error(`Invalid type of ${field.type}`);
            return null;
        }
      }
    }

    return builder;
  };

  return <><fieldset disabled>{renderFields()}</fieldset></>;
};
