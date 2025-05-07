import React from 'react';
import { Box, Flex, Text, Th, Thead, Tr, Image } from "@chakra-ui/react";
import filter from '../../img/filter.png';
import search from '../../img/search.png';
import upDown from '../../img/up-down.png';

interface AllPatientHeaderProps {
    showSurveyTrends: boolean;
    isLight: boolean;
}

export const AllPatientHeader: React.FC<AllPatientHeaderProps> = ({ showSurveyTrends, isLight }) => {

    return (
        <Thead>
            <Tr>
                <Th className="text-transform-capitalize" p={{ base: "10px 0px 10px 20px", md: "15px 20px" }} display="flex" alignItems="center">
                    <Text color='black' fontSize={{ base: "15px", md: "17px" }} mr="10px">
                        {showSurveyTrends ? "Surveys" : "Patients"}
                    </Text>
                    {/* {!showSurveyTrends && (
                        <Button colorScheme="blue" color="#3457D1" size="sm" variant="outline">
                            Add Patient
                        </Button>
                    )} */}
                </Th>
                <Th p={{ base: '0px 17px' }}>
                    <Flex direction="row" align="center" justify="end" style={{ mixBlendMode: !isLight ? "color" : "unset" }}>
                        <Box boxSize={{ base: "15px", md: "20px" }} mr="10px">
                            <Image src={search} alt="search" />
                        </Box>
                        <Box boxSize={{ base: "15px", md: "20px" }} mr="10px">
                            <Image src={filter} alt="filter" />
                        </Box>
                        <Box boxSize={{ base: "20px", md: "25px" }}>
                            <Image src={upDown} alt="sort" />
                        </Box>
                    </Flex>
                </Th>
            </Tr>
        </Thead>
    );
};
