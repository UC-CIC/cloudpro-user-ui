import React from "react";
import { PageLayout } from "../components/page-layout";
import { Container, Stack } from "@chakra-ui/react";
import { PatientDetails } from "../components/srgndash/Patient-details";

export const SurgeonPatientDetails: React.FC = () => {
    return (
        <PageLayout>
            <Container p={{ base: '0px 5px 0px 0px' }} maxW={"7xl"}>
                <Stack>
                    <PatientDetails />
                </Stack>
            </Container>
        </PageLayout>
    );
};
