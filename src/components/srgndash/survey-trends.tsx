import React, { useState } from "react";
import { PageLayout } from "../page-layout";
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
import { Pagination } from "../pagination/Pagination";
import { AllPatientHeader } from "../table/AllPatientHeader";
import { SurveyTable } from "../table/SurveyTable";

export const SurveyTrends: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = 10;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Add logic to fetch data for the new page, e.g., API call
    };

    const surveys = [
        { id: 0, name: "Blank Surgery Survey" },
        { id: 1, name: "Blank Surgery Survey" },
        { id: 2, name: "2 Weeks Post Blank Surgery Survey" },
        { id: 3, name: "Post-Blank Surgery Survey" },
        { id: 4, name: "Blank Surgery Survey" },
        { id: 5, name: "2 Weeks Post Blank Surgery Survey" },
        { id: 6, name: "Blank Surgery Survey" },
        { id: 7, name: "Post-Blank Surgery Survey" },
    ];

    const { colorMode } = useColorMode();
    const isLight = colorMode === "light";
    return (
        <>
            <PageLayout>
                <Container maxW={'7xl'}>
                    <Stack>
                        <ChakraProvider>
                            <Box color={isLight ? "" : "white"} p={{ base: '3', md: '6' }}>
                                <Heading onClick={() => window.history.go(-1)} mb={6} fontWeight='400' fontSize='25px'><Link _hover={{ textDecoration: 'none' }} color={isLight ? "black" : "white"}>&lt; Home &lt; Survey Trends</Link></Heading>
                                <Flex direction={{ base: "column", lg: "row" }} justify="space-between">
                                    <Box w={{ base: "100%", lg: "100%" }} h='max-content' mb={{ base: 4, lg: 0 }} boxShadow='0px 0px 6px 2px #00000033' mr='20px' borderRadius='9px' p='0' bg={isLight ? "white" : "gray.700"}>
                                        <TableContainer whiteSpace='normal'>
                                            <Table variant='simple'>

                                                <AllPatientHeader isLight={isLight} showSurveyTrends={true} />

                                                <SurveyTable isLight={isLight} surveys={surveys} />
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
        </>
    )
}