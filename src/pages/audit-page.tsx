import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '../components/page-layout';
import Loader from '../components/Loader/Loader';
import { useAuth } from '../hooks/useAuth';
import {
    getAudit,
    getQuestionnaireByProHash
  } from '../services/message.service';


import { useQuery } from 'react-query';
import {
    Container,
    Link as ChakraLink,
    ScaleFade,
    Stack,
    Text,
  } from '@chakra-ui/react';

import { FormState } from '../models/form-state'
  
export const Audit: React.FC = () => {
    const auth = useAuth();
    const { sid = ''} = useParams();


    //get audit payload
    const { data:auditData, isLoading } = useQuery('getAudit', async () => {
        const token = await auth.getAccessToken();
        const { data, error } = await getAudit(token,sid);
        if (!data && error) throw error;
        return data;
    });

    const proPack: string = auditData?.state.proPack;
    const currentState: FormState = auditData?.state as FormState;

    // Retrieve the questionnaire; depe3nd on existance of proPack
    const {
        data: questionnaire,
        isError: isLoadingQuestionnaireError,
        isLoading: isLoadingQuestionnaire,
    } = useQuery(
        {
            queryKey: 'questionnaire', 
            queryFn: async () => {
                const authToken = await auth.getAccessToken();
                const { data, error } = await getQuestionnaireByProHash(proPack, authToken);
                if (!data && error) throw new Error('Could not retrieve questionnaire');
                return data;
            }, 
            enabled: !!proPack
        }
    );



    if (isLoading || isLoadingQuestionnaire) {
        return (
        <Stack mt="32" align="center">
            <Loader />
        </Stack>
        );
    }


    return (
        <>
        <div>
            hi 
        </div>
        { JSON.stringify(auditData) }
        { JSON.stringify(questionnaire) }
        </>
    );
}