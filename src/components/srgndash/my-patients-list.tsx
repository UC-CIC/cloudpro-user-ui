import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Link,
  Flex,
  Table,
  TableContainer,
  Container,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { PageLayout } from '../page-layout';
import { Pagination } from "../pagination/Pagination";
import { PatientsTable } from "../table/PatientsTable";
import { AllPatientHeader } from "../table/AllPatientHeader";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "react-query";
import { getPatientListForSurgeon } from "../../services/message.service";

interface Patient {
  name: string;
  last_completed_survey: string;
  sub: string,
  patient_compliance_rate?: {
    total_survey: number;
  };
  surgery_name: string;
  surgery_date: string;
  last_completed_survey_name: string;
  last_completed_survey_date: string
}

export const MyPatientsList: React.FC = () => {

  const auth = useAuth();

  const { isLoading, data: patientsData = {} } = useQuery('getPatientList', async () => {
    const token = await auth.getAccessToken();
    const { data, error } = await getPatientListForSurgeon(auth.sub, token);
    if (!data && error) throw error;
    return data?.patients;
  });

  const upcomingSurgery = patientsData?.upcoming_surgery || [];
  const completedSurgery = patientsData?.completed_surgery || [];
  const allPatients = [...upcomingSurgery, ...completedSurgery];

  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPatients, setDisplayedPatients] = useState<Patient[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    if (Array.isArray(allPatients)) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setDisplayedPatients(allPatients.slice(startIndex, endIndex));
    }
  }, [allPatients, currentPage]);

  const totalPages = Math.ceil(allPatients.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";

  return (
    <PageLayout>
      <Container maxW={'7xl'}>
        <Stack>
          <ChakraProvider>
            <Box p={{ base: '3', md: '6' }}>
              <Heading onClick={() => window.history.go(-1)} mb={6} fontWeight='400' fontSize='25px'>
                <Link _hover={{ textDecoration: 'none' }} color={isLight ? "black" : "white"}>&lt; Back</Link>
              </Heading>
              <Flex direction={{ base: "column", lg: "row" }} justify="space-between">
                <Box bg={isLight ? "white" : "gray.700"} w={{ base: "100%", lg: "100%" }} mb={{ base: 4, lg: 0 }} boxShadow='0px 0px 6px 2px #00000033' mr={{ base: 0, lg: '20px' }} borderRadius='9px' p='0'>
                  <TableContainer whiteSpace='normal'>
                    <Table variant='simple'>
                      <AllPatientHeader isLight={isLight} showSurveyTrends={false} />
                      <PatientsTable isLoading={isLoading} isLight={isLight} displayedPatients={displayedPatients} />
                    </Table>
                  </TableContainer>
                </Box>
              </Flex>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </Box>
          </ChakraProvider>
        </Stack>
      </Container>
    </PageLayout>
  );
};
