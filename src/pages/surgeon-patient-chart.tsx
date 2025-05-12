import React from "react";
import { PageLayout } from "../components/page-layout";
import { Container, Stack } from "@chakra-ui/react";
import SurveyDt from "../components/srgndash/survey-details";

export const SurgeonPatientChart: React.FC = () => {
    return (
        <PageLayout>
            <Container p={{ base: '0px 5px 0px 0px' }} maxW={"7xl"}>
                <Stack>
                    <SurveyDt />
                </Stack>
            </Container>
        </PageLayout>
    );
};
