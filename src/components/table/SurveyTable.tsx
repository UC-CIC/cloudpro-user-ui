import React from "react";
import { Link, Tbody, Td, Tr } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Survey {
  id: number;
  name: string;
}

interface SurveyTableProps {
  surveys: Survey[];
  isLight: boolean
}

export const SurveyTable: React.FC<SurveyTableProps> = ({ surveys, isLight }) => {
  const navigate = useNavigate()

  return (
    <Tbody>
      {surveys?.map((survey) => (
        <Tr key={survey.id} onClick={() => navigate('/trends-survey-details')}>
          <Td p="9px 20px" fontWeight={isLight ? 600 : 400} color={isLight ? "black.500" : "white"}>
            <Link _hover={{ textDecoration: "none" }} >{survey.name}</Link>
          </Td>
          <Td p="9px 20px" textAlign="end">
            <Link _hover={{ textDecoration: "none" }} color="#3457D1" fontSize="21px">
              &gt;
            </Link>
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
};
