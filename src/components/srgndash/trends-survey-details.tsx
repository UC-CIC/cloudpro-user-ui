import React, { useState } from "react";
import {
    ChakraProvider,
    Box,
    Heading,
    Flex,
    Text,
    Stack,
    Container,
    Collapse,
    useColorMode,
    Link,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import SymptomPieChart from "../../charts/PieChart";
import { PageLayout } from "../page-layout";

export const TrendsSurveyDetails: React.FC = () => {
    const [isOpen, setIsOpen] = useState<{ [key: number]: boolean }>({});

    const toggleCollapse = (id: number) => {
        setIsOpen(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const details = [
        { id: 1, name: "Survey question, how do you feel 3 days post operation?", des: "This will be an explanatory paragraph, giving more details on the graph/the answers that patients had given. When the user first opens this page all the questions will be open and they will have the option to toggle questions closed/open as they want. This will be an explanatory paragraph, giving more details on the graph/the answers that patients had given." },
        { id: 2, name: "Survey question, how do you feel 3 days post operation?", des: "This will be an explanatory paragraph, giving more details on the graph/the answers that patients had given. When the user first opens this page all the questions will be open and they will have the option to toggle questions closed/open as they want. This will be an explanatory paragraph, giving more details on the graph/the answers that patients had given. " },
        { id: 3, name: "Survey question, how do you feel 3 days post operation?", des: "This will be an explanatory paragraph, giving more details on the graph/the answers that patients had given. When the user first opens this page all the questions will be open and they will have the option to toggle questions closed/open as they want. This will be an explanatory paragraph, giving more details on the graph/the answers that patients had given. " },
    ];

    const { colorMode } = useColorMode();
    const isLight = colorMode === "light";

    const data = [
        { name: '30% Moderate Symptom', value: 30, color: '#3b82f6' },
        { name: '10% Slight Symptom', value: 10, color: '#a855f7' },
        { name: '60% No Symptom', value: 60, color: '#1d4ed8' },
    ];

    return (
        <PageLayout>
            <Container maxW={"7xl"}>
                <Stack>
                    <Box color={isLight ? "black" : "white"} p={{ base: 4, md: 6 }}>
                        <Heading onClick={() => window.history.go(-1)} mb={6} fontWeight='400' fontSize='25px'><Link _hover={{ textDecoration: 'none' }} color={isLight ? "black" : "white"}>&lt; Home &lt; Survey Trends - 3 Days Post Surgery Survey</Link></Heading>

                        <Flex direction={{ base: "column", lg: "row" }} justify="space-between">
                            <Box
                                w={{ base: "100%", lg: "70%" }}
                                boxShadow="0px 0px 6px 2px #00000033"
                                m={{ base: "10px 0px", lg: "10px 20px 10px 0px" }}
                                borderRadius="9px"
                                p="20px"
                                bg={isLight ? "white" : "gray.700"}
                            >
                                <Heading fontSize={{ base: "15px", md: "17px" }} color={isLight ? "black" : "white"}>
                                    3 Days Post Surgery Survey
                                </Heading>

                                {details.map((item) => (
                                    <Box
                                        key={item.id}
                                        w="100%"
                                        m="20px 0px"
                                        borderRadius="9px"
                                        p="10px"
                                        bg={isLight ? "#F5F5F5" : "gray.600"}
                                    >
                                        <Flex
                                            justifyContent="space-between"
                                            alignItems="center"
                                            onClick={() => toggleCollapse(item.id)}
                                            cursor="pointer"
                                        >
                                            <Text color={isLight ? "black" : "white"} fontWeight="700" fontSize="md">
                                                {item.id}. {item.name}
                                            </Text>
                                            <Box>
                                                {isOpen[item.id] ? <ChevronUpIcon fontSize="20px" /> : <ChevronDownIcon fontSize="20px" />}
                                            </Box>
                                        </Flex>

                                        <Collapse in={!isOpen[item.id]} animateOpacity>
                                            <Box pl="18px">

                                                <Box width={{ base: "100%", md: "50%" }} height={{ base: "300px", md: "400px" }}>
                                                    <SymptomPieChart data={data} />
                                                </Box>

                                                <Text fontWeight="600" mt={2}>
                                                    {item.des}
                                                </Text>
                                            </Box>
                                        </Collapse>
                                    </Box>
                                ))}
                            </Box>

                            <Box
                                w={{ base: "100%", lg: "30%" }}
                                boxShadow="0px 0px 6px 2px #00000033"
                                m={{ base: "10px 0px", lg: "10px 0px 10px 0px" }}
                                borderRadius="9px"
                                p="20px"
                                bg={isLight ? "white" : "gray.700"}
                                height='fit-content'
                            >
                                <Heading fontSize={{ base: "15px", md: "17px" }} color={isLight ? "black" : "white"}>
                                    Based on 142 Completed Surveys Last Updated 7/2/2024
                                </Heading>
                                <Text color={isLight ? 'black' : 'white'} p="10px 0 0 0" fontSize="md">
                                    General Information on Survey
                                    <ChevronDownIcon fontSize="20px" />
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                </Stack>
            </Container>
        </PageLayout>
    );
};
