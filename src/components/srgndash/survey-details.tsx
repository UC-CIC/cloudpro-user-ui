import React, { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, TimeScale, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, ChartOptions } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';

import {
    Box, ChakraProvider, ColorModeScript, extendTheme, Flex, Heading, Text,
    Checkbox, CheckboxGroup, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useColorMode,
    Center,
    Button,
    IconButton
} from '@chakra-ui/react';
import { getPatientDetailsForSurgeon } from '../../services/message.service';
import { useQuery } from 'react-query';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';
import dayjs from 'dayjs';
import { FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';

Chart.register(LineElement, TimeScale, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, annotationPlugin);

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
    propack: string;
    score: string;
    due: string;
    sid: string
}

const SurveyDt: React.FC = () => {
    const { sub, propack: routeProType } = useParams<{ sub: string; propack: string }>();
    const auth = useAuth();
    const navigate = useNavigate();

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

    const [filteredSurveyData, setFilteredSurveyData] = useState<SurveyData[]>([]);
    const [sortField, setSortField] = useState<string | null>('completed');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const propack = routeProType || '';

    const handleSort = (field: string) => {
        if (['target', 'completed', 'score'].includes(field)) {
            const isAsc = sortField === field && sortOrder === 'asc';
            setSortOrder(isAsc ? 'desc' : 'asc');
            setSortField(field);
        }
    };

    const [pro_type, setPro_type] = useState('')

    useEffect(() => {
        if (patient?.survey_data) {
            const filteredData = patient.survey_data.filter((x: any) => x.propack === propack);

            if (filteredData.length > 0) {
                setPro_type(filteredData[0].pro_type);
                setFilteredSurveyData(filteredData);
            } else {
                setPro_type('');
                setFilteredSurveyData([]);
            }
        }
    }, [patient, propack]);



    const [selectedDatasets, setSelectedDatasets] = useState<string[]>([pro_type]);
    useEffect(() => {
        if (pro_type) {
            setSelectedDatasets([pro_type]);
        }
    }, [pro_type]);

    const sortedSurveyData = useMemo(() => {
        if (!sortField) return filteredSurveyData;

        return [...filteredSurveyData].sort((a, b) => {
            let aField: string | number = "";
            let bField: string | number = "";

            if (sortField === "target") {
                aField = a.target.value;
                bField = b.target.value;
            } else if (sortField === "completed") {
                aField = dayjs(a.completed.date).isValid() ? dayjs(a.completed.date).valueOf() : Infinity;
                bField = dayjs(b.completed.date).isValid() ? dayjs(b.completed.date).valueOf() : Infinity;
            } else if (sortField === "score") {
                aField = parseFloat(a.score);
                bField = parseFloat(b.score);
            }

            if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
            if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [sortField, sortOrder, filteredSurveyData]);

    const [physicalFunctionData, setPhysicalFunctionData] = useState<(number | null)[]>([]);
    const [nationalScores, setNationalScores] = useState<(number | null)[]>([]);
    const [similarScores, setSimilarScores] = useState<(number | null)[]>([]);

    const filteredData = useMemo(() => {
        const validData = filteredSurveyData.filter(
            (survey) => {
                if (survey.completed.date === 'NA') {
                    return dayjs(survey.due).isValid()
                  }
                  return dayjs(survey.completed.date).isValid()
            }
          );
          
          let labels = validData.map((survey) => {
            if (survey.completed.date === 'NA') {
              return new Date(survey.due);
            }
            return new Date(survey.completed.date);
          });          
          
        const physicalFunctionData = validData.map((survey) => {
            return parseFloat(survey.score) ? parseFloat(survey.score) : null
        });
        setPhysicalFunctionData(physicalFunctionData) 

        const national = patient?.national_average_scores[pro_type] as Record<string, number>;

        const nationalScores = validData?.map((survey) => {
            const key = survey.target?.target;
            return national && national[key] ? national[key] : null;
        });

        setNationalScores(nationalScores)

        const similar = patient?.similar_patients_scores[pro_type] as Record<string, number>;

        const similarScores = validData?.map((survey) => {
            const key = survey?.target?.target;
            return similar && similar[key] ? similar[key] : null;
        });

        setSimilarScores(similarScores)

        const nationalAverageData = nationalScores.slice(0, labels?.length);
        const similarPatientsData = similarScores.slice(0, labels?.length);

        return {
            labels: labels,
            datasets: [
                {
                    label: pro_type,
                    data: physicalFunctionData,
                    borderColor: '#F56565',
                    backgroundColor: '#F56565',
                    fill: false,
                    tension: 0.1,
                    borderWidth: 2,
                },
                {
                    label: 'National Average',
                    data: nationalAverageData,
                    borderColor: '#4299e1',
                    backgroundColor: '#4299e1',
                    fill: false,
                    tension: 0.1,
                    borderWidth: 2,
                },
                {
                    label: 'Similar Patients',
                    data: similarPatientsData,
                    borderColor: '#38B2AC',
                    backgroundColor: '#38B2AC',
                    fill: false,
                    tension: 0.1,
                    borderWidth: 2,
                },
            ],
        };
    }, [sortedSurveyData]);

    const chartData = {
        labels: filteredData.labels,
        datasets: filteredData.datasets.filter((dataset) =>
            selectedDatasets.includes(dataset.label)
        ),
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: 'black',
                    filter: (legendItem) => {
                        // Hide 'National Average' and 'Similar Patients' from the legend
                        return ![pro_type, 'National Average', 'Similar Patients'].includes(legendItem.text);
                    }
                },
            },
            title: {
                display: false,
            },
            annotation: {
                annotations: {
                    procedureLine: {
                        type: 'line',
                        xMin: new Date(patient?.surgery_date).getTime(),
                        xMax: new Date(patient?.surgery_date).getTime(),
                        borderColor: '#38B2AC',
                        borderWidth: 2,
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'MM/dd/yyyy',
                    displayFormats: {
                        day: 'MM/dd/yyyy',
                    },
                },
                ticks: {
                    source: 'labels',
                    autoSkip: true, // Automatically skips labels if they overlap
                    maxRotation: window.innerWidth < 600 ? 90 : 45, // Adjust rotation based on screen width
                    minRotation: window.innerWidth < 600 ? 90 : 30, // Minimum rotation to avoid overlap
                    callback: (value) => dayjs(value).format('MM/DD/YY'), // Format the x-axis labels
                    font: {
                        size: window.innerWidth < 600 ? 10 : 12,
                    }
                },
                display: true,
                title: {
                    display: true,
                },
            },
            y: {
                display: true,
                beginAtZero: true,
                title: {
                    display: true,
                },
            },
        },
        elements: {
            point: {
                radius: 2,
            },
        },
    };
    

    const convertToCSV = (array: any) => {
        const headers = [" Target", " Completed", " Score"];
        const rows = array.map((survey: any) => [
            survey?.target?.target ? `" ${survey?.target?.target}"` : '-',
            survey?.completed?.date ? `" ${survey?.completed?.date}"` : '-',
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
            //    pro_type: item.pro_type || '-',
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

    const { colorMode } = useColorMode();
    const isLight = colorMode === "light";

    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader />
            </Center>
        );
    }

    if (error || !patient) {
        return (
            <ChakraProvider theme={theme}>
                <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                <Box p={{ base: "3", md: "6" }} display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Text color={isLight ? 'black' : 'white'} fontSize="xl">No data found.</Text>
                </Box>
            </ChakraProvider>
        );
    }

    return (
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Box p={{ md: "6" }}>
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
                    mb={{ base: 1, md: 2 }}
                    fontWeight="400"
                    fontSize={{ base: "16px", md: "18px" }}
                >
                    <Text
                        color={isLight ? 'black' : 'white'}
                        mb={{ base: 3, md: 5 }}
                        mr={{ base: 0, md: 1 }}
                        letterSpacing='0.3px'
                    >
                        {patient?.name} | {patient?.surgery_date} {patient?.surgery_name} &gt; {pro_type}
                    </Text>
                </Heading>

                <Box
                    w="100%"
                    h="max-content"
                    boxShadow="0px 0px 6px 2px #c3c3c333"
                    mb="20px"
                    borderRadius="9px"
                    p={{ base: '20px', md: '20px' }}
                    bg={isLight ? "white" : "gray.700"}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Box h='auto' w="100%" maxW="800px" mb={4}>
                        <Line data={chartData} options={options} />
                    </Box>

                    <Box pb='7px'>
                        <Text color='teal.500' fontSize='14px'>Procedure {patient?.surgery_date}</Text>
                    </Box>
                    <CheckboxGroup
                        colorScheme="blue"
                        value={selectedDatasets}
                        onChange={(values: string[]) => setSelectedDatasets(values)}
                    >
                        <Flex
                            direction={{ base: 'column', md: 'row' }}
                            alignItems="flex-start"
                            justifyContent="left"
                            wrap="wrap"
                        >
                            {Array.isArray(physicalFunctionData) && physicalFunctionData.some(score => score !== null) && (
                                <Checkbox sx={{
                                    '&.chakra-checkbox input:checked + span': {
                                        background: 'red.400',
                                        borderColor: 'red.400'
                                    }
                                }} value={pro_type} fontSize={{ base: 'sm', md: 'md' }} mb={{ base: 2, md: 0 }} mr={{ base: 0, md: 4 }}>
                                    <span style={{ fontSize: '14px', color: isLight ? 'black' : 'white' }}>{pro_type}</span>
                                </Checkbox>
                            )}

                            {Array.isArray(nationalScores) && nationalScores.some(score => score !== null) && (
                                <Checkbox sx={{
                                    '&.chakra-checkbox input:checked + span': {
                                        background: 'blue.400',
                                        borderColor: 'blue.400'
                                    }
                                }} value="National Average" fontSize={{ base: 'sm', md: 'md' }} mb={{ base: 2, md: 0 }} mr={{ base: 0, md: 4 }}>
                                    <span style={{ fontSize: '14px', color: isLight ? 'black' : 'white' }}>National Average</span>
                                </Checkbox>
                            )}

                            {Array.isArray(similarScores) && similarScores.some(score => score !== null) && (
                                <Checkbox sx={{
                                    '&.chakra-checkbox input:checked + span': {
                                        background: 'teal.400',
                                        borderColor: 'teal.400'
                                    }
                                }} value="Similar Patients" fontSize={{ base: 'sm', md: 'md' }}>
                                    <span style={{ fontSize: '14px', color: isLight ? 'black' : 'white' }}>Similar Patients</span>
                                </Checkbox>
                            )}


                        </Flex>
                    </CheckboxGroup>


                </Box>

                <Flex align="center" justify="flex-end" alignItems="start">
                    <Flex align="center" pb='23px' w={{ base: 'full', md: 'auto' }}>
                    </Flex>
                    <Box textAlign="right" mb="20px">
                        <IconButton
                            icon={<FaDownload />}
                            colorScheme="teal"
                            size="sm"
                            onClick={() => downloadXLSX(sortedSurveyData)}
                            aria-label="Download XLSX"
                        />
                    </Box>
                </Flex>

                <Box
                    w="100%"
                    h="max-content"
                    boxShadow="0px 0px 6px 2px #c3c3c333"
                    mb="20px"
                    borderRadius="9px"
                    p={{ base: '10px', md: '15px 20px' }}
                    bg={isLight ? "white" : "gray.700"}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                >
                    <Box w="100%">
                        <TableContainer whiteSpace='normal'>
                            <Table>
                                <Thead>
                                    <Tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <Th borderBottom='1px solid #f8f4ff !important' onClick={() => handleSort('target')} cursor="pointer" p={{ base: '13px 10px' }}><Text fontSize='15px' fontWeight='700' color={isLight ? 'black' : 'white'} align="left">
                                            Target {sortField === 'target' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                        </Text></Th>
                                        <Th borderBottom='1px solid #f8f4ff !important' onClick={() => handleSort('completed')} cursor="pointer" p={{ base: '13px 10px' }}>
                                            <Text fontSize='15px' fontWeight='700' color={isLight ? 'black' : 'white'} align="left">
                                                Completed {sortField === 'completed' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                            </Text></Th>
                                        <Th borderBottom='1px solid #f8f4ff !important' onClick={() => handleSort('score')} cursor="pointer" p={{ base: '13px 10px' }}><Text fontSize='15px' fontWeight='700' color={isLight ? 'black' : 'white'} align="left">
                                            Score {sortField === 'score' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                        </Text></Th>
                                        <Th borderBottom='1px solid #f8f4ff !important'></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {sortedSurveyData?.length ? (
                                        sortedSurveyData?.map((survey: SurveyData, index: number) => {
                                            const surveyDate = dayjs(survey?.completed?.date);
                                            const isPastDate = surveyDate.isBefore(dayjs(), 'day');
                                            return (
                                                <Tr onClick={() => navigate(`/audit/${survey.sid}`, {
                                                    state: {
                                                        info: `${patient?.name} | ${patient?.surgery_date} ${patient?.surgery_name} > ${pro_type}`
                                                    }
                                                })} key={index} cursor='pointer' bg={(!isPastDate && !isLight) ? '#4c6081' : !isPastDate ? '#eaeaea' : ''}>
                                                    <Td borderBottom='none' p={{ base: '13px 10px' }}>
                                                        <Text align="left" color={isLight ? 'black' : 'white'} fontWeight="normal">
                                                            {survey.target?.target}
                                                        </Text>
                                                    </Td>
                                                    <Td borderBottom='none' p={{ base: '13px 10px' }}>
                                                        <Text align="left" color={isLight ? 'black' : 'white'} fontWeight="normal">
                                                            {survey?.completed?.date}
                                                        </Text>
                                                    </Td>
                                                    <Td borderBottom='none' p={{ base: '13px 10px' }}>
                                                        <Text align="left" color={isLight ? 'black' : 'white'} fontWeight="normal">
                                                            {survey.score}
                                                        </Text>
                                                    </Td>
                                                    <Td borderBottom='none' p={{ base: '13px 10px'}}>
                                                    <Text align="left" color={isLight ? 'black' : 'white'} fontWeight="normal">
                                                        &gt;
                                                    </Text>
                                                </Td>
                                                </Tr>
                                            );
                                        })
                                    ) : (
                                        <Tr>
                                            <Td colSpan={3} borderBottom='none'>
                                                <Text align="center" color="black">
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
            </Box>
        </ChakraProvider>
    );
};

export default SurveyDt;
