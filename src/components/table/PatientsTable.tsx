import React from "react";
import { Link, Tbody, Td, Text, Tr, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Patient {
  name: string;
  last_completed_survey: string;
  sub: string;
  patient_compliance_rate?: {
    total_survey: number;
  };
  surgery_name: string;
  surgery_date: string;
  last_completed_survey_name: string;
  last_completed_survey_date: string;
}

interface PatientsTableProps {
  displayedPatients: Patient[];
  isLight: boolean;
  isLoading: boolean;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({ displayedPatients, isLight, isLoading }) => {
  const navigate = useNavigate();

  return (
    <Tbody>
      {isLoading ? (
        <Tr>
          <Td colSpan={2} textAlign="center">
            <Spinner />
          </Td>
        </Tr>
      ) : displayedPatients?.length > 0 ? (
        displayedPatients.map((patient, index) => {
          return (
            <Tr key={index} cursor='pointer' onClick={() => navigate(`/patient-details/${patient.sub}`)}>
              <Td p={{ base: '10px 0px 10px 20px', md: '10px 20px' }} color={isLight ? "black.500" : "white"}>
                {patient?.name && (
                  <Text color={isLight ? "black" : "white"}>{patient?.name}</Text>
                )}
                {(patient?.surgery_date) && (
                  <Text fontWeight={isLight ? 600 : 400}>Surgery Date : {patient?.surgery_date}</Text>
                )}
                {(patient?.last_completed_survey_name || patient?.last_completed_survey_date) &&
                  (
                    <Text fontWeight={isLight ? 600 : 400}>Last completed ePRO : {patient?.last_completed_survey_name}, {patient?.last_completed_survey_date}</Text>
                  )}
              </Td>
              <Td textAlign="end">
                {/* <Link _hover={{ textDecoration: "none" }} color="#3457D1" fontSize="21px">
                  &gt;
                </Link> */}
              </Td>
            </Tr>
          );
        })
      ) : (
        <Tr>
          <Td colSpan={2} textAlign="center">
            <Text>No data found</Text>
          </Td>
        </Tr>
      )}
    </Tbody>
  );
};
