import React, { useState, useEffect } from "react";
import {
    ChakraProvider,
    Box,
    Table,
    TableContainer,
    Text,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    useColorMode,
    Center,
    extendTheme,
    ColorModeScript,
    Heading,
    Flex,
    Input,
    Progress,
    Stack,
    Button,
    IconButton,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useAuth } from "../../hooks/useAuth";
import { getPatientDetailsForSurgeon } from "../../services/message.service";
import Loader from "../Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import HomePie from "../../charts/HomePie";
import { FaDownload } from "react-icons/fa";
import * as XLSX from 'xlsx';

const theme = extendTheme({
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
    },
});
interface SurveyData {
    target: {
        target: string;
        value: number;
    };
    completed: {
        date: string;
        value: string;
    };
    pro_type: string;
    sid: string;
    propack: string;
    score: string;
    due: string;
}

export const PatientDetails: React.FC = () => {
    const { sub } = useParams<{ sub: string }>();
    const auth = useAuth();
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const isLight = colorMode === "light";

    const { isLoading, data: patient, error } = useQuery(
        ["getPatientDetails", sub],
        async () => {
            if (!sub) {
                throw new Error("sub is not defined");
            }
            const token = await auth.getAccessToken();
            const { data, error } = await getPatientDetailsForSurgeon(sub, token);
            if (error) throw error;
            return data;
        },
        { enabled: !!sub }
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSurveyData, setFilteredSurveyData] = useState<SurveyData[]>([]);
    const [sortField, setSortField] = useState<string>("completed");
    const [sortOrder, setSortOrder] = useState<string>("asc");

    useEffect(() => {
        if (patient) {
            // Filter survey data based on the search query
            const filteredData = patient.survey_data.filter((survey: SurveyData) =>
                String(survey.target.target).toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(survey.completed.date).toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(survey.pro_type).toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(survey.score).toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Sort filtered data based on the sortField and sortOrder
            const sortedData = filteredData.sort((a: SurveyData, b: SurveyData) => {
                let aValue: string | number = "";
                let bValue: string | number = "";

                if (sortField === "target") {
                    aValue = a.target.value;
                    bValue = b.target.value;
                } else if (sortField === "completed") {
                    aValue = a.completed.date.toLowerCase();
                    bValue = b.completed.date.toLowerCase();
                } else if (sortField === "pro_type") {
                    aValue = a.pro_type.toLowerCase();
                    bValue = b.pro_type.toLowerCase();
                } else if (sortField === "score") {
                    // Convert score to number for accurate numerical sorting
                    aValue = parseFloat(a.score);
                    bValue = parseFloat(b.score);
                }

                // Compare values
                if (aValue < bValue) {
                    return sortOrder === "asc" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortOrder === "asc" ? 1 : -1;
                }
                return 0;
            });

            // Update the state with the sorted and filtered data
            setFilteredSurveyData(sortedData);
        }
    }, [searchQuery, patient, sortField, sortOrder]);

    const convertToCSV = (array: any) => {
        const headers = [" Target", " Completed", " PRO Type", " Score"];
        const rows = array.map((survey: any) => [
            survey?.target?.target ? `" ${survey?.target?.target}"` : '-',
            survey?.completed?.date ? `" ${survey?.completed?.date}"` : '-',
            survey?.pro_type ? `" ${survey?.pro_type}"` : '-',
            survey?.score ? `" ${survey?.score}"` : '-',
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((e: any) => e.join(","))
        ].join("\n");

        return csvContent;
    };


    const downloadXLSX = (data: any[]) => {
        const flattened = data.map((item: any) => ({
            target: item.target?.target || '-',
            completed_date: item.completed?.date || '-',
            pro_type: item.pro_type || '-',
            score: item.score || '-',
            // due: item.due || '-',
        }));

        const worksheet = XLSX.utils.json_to_sheet(flattened);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Patient Details");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "patients_details.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    const handleSort = (field: string) => {
        const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(newOrder);
    };

    const getSortIndicator = (field: string) => {
        if (sortField === field) {
            return sortOrder === "asc" ? " ▲" : " ▼";
        }
        // return " ▲";
    };

    const completedSurveys = patient?.patient_compliance_rate?.completed_survey || 0;
    const pendingSurveys = patient?.patient_compliance_rate?.pending_survey || 0;
    const overdueSurveys = patient?.patient_compliance_rate?.overdue_survey || 0;
    const totalSurveys = completedSurveys + pendingSurveys + overdueSurveys;

    const ChartData = [
        { value: completedSurveys, color: '#38B2AC', label: 'Completed' },
        { value: pendingSurveys, color: '#4299e1', label: 'Pending' },
        { value: overdueSurveys, color: '#F56565', label: 'Overdue' },
    ];


    return (
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Box p={{ md: "6" }}>
                <Box
                    w="100%"
                    h="max-content"
                    mb="3px"
                    borderRadius="9px"
                >
                    <Flex direction={{ base: "column", lg: "row" }} justify="space-between">
                        <Box w={{ base: "100%", lg: "50%" }}>
                            <Heading
                                mb={{ base: 1, md: 2 }}
                                cursor="pointer"
                                onClick={() => window.history.go(-1)}
                                fontWeight="400"
                                fontSize={{ base: "16px", md: "18px" }}
                            >
                                <Text
                                    color='teal.500'
                                    mb={{ base: 1, md: 0 }}
                                    mr={{ base: 0, md: 1 }}
                                >
                                    &lt; Back
                                </Text>
                            </Heading>
                            <Heading
                                // mb={{ base: 1, md: 2 }}
                                fontWeight="400"
                                fontSize={{ base: "16px", md: "18px" }}
                            >
                                <Text
                                    color={isLight ? 'black' : 'white'}
                                    mb={{ base: 3, md: 3 }}
                                    mr={{ base: 0, md: 1 }}
                                    letterSpacing='0.3px'
                                >
                                    {patient?.name} | {patient?.surgery_date} {patient?.surgery_name}
                                </Text>

                                <Flex align="center" justify="flex-start" alignItems="start">
                                    <Flex align="center" w={{ base: 'full', md: 'auto' }}>
                                        <Input
                                            placeholder="Search..."
                                            size="sm"
                                            mr="2"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            w={{ base: 'full', md: '300px' }}
                                        />
                                    </Flex>
                                    <Box textAlign="right">
                                        <IconButton
                                            icon={<FaDownload />}
                                            colorScheme="teal"
                                            size="sm"
                                            onClick={() => downloadXLSX(filteredSurveyData)}
                                            aria-label="Download XLSX"
                                        />
                                    </Box>
                                </Flex>
                            </Heading>
                        </Box>
                        {/* bg={isLight ? '#F3F6FF' : '#4c6081'} */}
                        <Box w={{ base: "100%", lg: "50%" }} borderRadius="9px">
                            <Flex direction="row" justifyContent={{ base: 'center', md: 'right' }} alignItems="center" wrap="nowrap">
                                <Box mb={{ base: '5px' }} width={{ base: "40%", md: "25%" }} textAlign="center" mr={{ base: '10px', md: '0px' }}>
                                    <HomePie data={ChartData} showLabels={false} />
                                </Box>
                                <Box textAlign="left" mr='10px'>
                                    <Text fontSize={{ base: '10px', md: '15px' }} color="#38B2AC">
                                        <span style={{ fontSize: '16px', fontWeight: '400' }}>{completedSurveys}</span> <span style={{ fontSize: '16px', fontWeight: '400', color: isLight ? 'black' : 'white' }}>completed PROs</span>
                                    </Text>
                                    <Text fontSize={{ base: '10px', md: '15px' }} color="#4299e1">
                                        <span style={{ fontSize: '16px', fontWeight: '400' }}>{pendingSurveys}</span> <span style={{ fontSize: '16px', fontWeight: '400', color: isLight ? 'black' : 'white' }}>pending PROs</span>
                                    </Text>
                                    <Text fontSize={{ base: '10px', md: '15px' }} color="#F56565">
                                        <span style={{ fontSize: '16px', fontWeight: '400' }}>{overdueSurveys}</span> <span style={{ fontSize: '16px', fontWeight: '400', color: isLight ? 'black' : 'white' }}>overdue PROs</span>
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>

                <Box
                    w="100%"
                    h="max-content"
                    boxShadow="0px 0px 6px 2px #c3c3c333"
                    mb="20px"
                    borderRadius="9px"
                    p={{ base: '5px', md: '15px 20px' }}
                    bg={isLight ? "white" : "gray.700"}
                >
                    <TableContainer whiteSpace='normal'>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th borderBottom='1px solid #f8f4ff !important' onClick={() => handleSort("target")} cursor='pointer'
                                        p={{ base: '13px 5px 13px 5px', md: '10px 10px 15px 20px' }}><Text fontSize='15px' fontWeight='700' color={isLight ? 'black' : 'white'} align="left">Target{getSortIndicator("target")}</Text></Th>
                                    {/* {getSortIndicator("target")} */}
                                    <Th borderBottom='1px solid #f8f4ff !important' p={{ base: '13px 5px', md: '10px 10px 15px 20px' }}
                                        onClick={() => handleSort("completed")}
                                        cursor="pointer"
                                    >
                                        <Text fontSize='15px' fontWeight='700' color={isLight ? 'black' : 'white'} align="left">
                                            Completed{getSortIndicator("completed")}
                                        </Text>
                                    </Th>
                                    <Th borderBottom='1px solid #f8f4ff !important' p={{ base: '13px 5px', md: '10px 10px 15px 20px' }}
                                        onClick={() => handleSort("pro_type")}
                                        cursor="pointer"
                                    >
                                        <Text fontSize='15px' fontWeight='700' color={isLight ? 'black' : 'white'} align="left">
                                            PRO Type{getSortIndicator("pro_type")}
                                        </Text>
                                    </Th>
                                    <Th borderBottom='1px solid #f8f4ff !important' p={{ base: '13px 5px', md: '10px 10px 15px 20px' }}
                                        onClick={() => handleSort("score")}
                                        cursor="pointer"
                                    >
                                        <Text fontSize='15px' fontWeight='700' color={isLight ? 'black' : 'white'} align="left">
                                            Score{getSortIndicator("score")}
                                        </Text>
                                    </Th>
                                    <Th borderBottom='1px solid #f8f4ff !important' p={{ base: '13px 5px', md: '10px 10px 15px 20px' }}></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredSurveyData.length ? (
                                    filteredSurveyData.map((survey: SurveyData, index: number) => {
                                        const surveyDate = dayjs(survey.completed.date);
                                        const isPastDate = surveyDate.isBefore(dayjs(), 'day');
                                        return (
                                            <Tr key={index} onClick={() => navigate(`/survey-details/${sub}/${survey?.propack}`)} cursor='pointer'
                                                // bg={isPastDate ? '' : '#eaeaea'}
                                                bg={(!isPastDate && !isLight) ? '#4c6081' : !isPastDate ? '#eaeaea' : ''}

                                            >
                                                <Td borderBottom='none' p={{ base: '13px 5px', md: '20px' }}>
                                                    <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal">
                                                        {survey.target.target}
                                                    </Text>
                                                </Td>
                                                <Td borderBottom='none' p={{ base: '13px 5px', md: '20px' }}>
                                                    <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal">
                                                        {survey.completed.date}
                                                    </Text>
                                                </Td>
                                                <Td borderBottom='none' p={{ base: '13px 5px', md: '20px' }}>
                                                    <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal">
                                                        {survey.pro_type}
                                                    </Text>
                                                </Td>
                                                <Td borderBottom='none' p={{ base: '13px 5px', md: '20px' }}>
                                                    <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal">
                                                        {survey.score}
                                                    </Text>
                                                </Td>
                                                <Td borderBottom='none' p={{ base: '13px 5px', md: '20px' }}>
                                                    <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal">
                                                        &gt;
                                                    </Text>
                                                </Td>
                                            </Tr>
                                        );
                                    })
                                ) : (
                                    <Tr>
                                        <Td borderBottom='none' colSpan={5}>
                                            <Text align="center" color={isLight ? 'black' : 'white'}>
                                                No data found
                                            </Text>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </ChakraProvider>
    );
};
