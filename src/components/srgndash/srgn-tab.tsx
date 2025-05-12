import React, { useState, useMemo } from "react";
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
  Flex,
  Input,
  ColorModeScript,
  Center,
  extendTheme,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useAuth } from "../../hooks/useAuth";
import { getAllPatientDetails, getPatientListForSurgeon } from "../../services/message.service";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import HomePie from "../../charts/HomePie";
import dayjs from "dayjs";
import { FaDownload } from "react-icons/fa";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export const SrgnTab: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { isLoading, data } = useQuery("getPatientList", async () => {
    const token = await auth.getAccessToken();
    const { data, error } = await getPatientListForSurgeon(auth.sub, token);
    if (!data && error) throw error;
    return data;
  });

  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";

  const [sortField, setSortField] = useState<string>("last_activity");
  const [sortOrder, setSortOrder] = useState<string>("desc"); // Default to descending order
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  const filteredPatients = useMemo(() => {
    const allPatients = data?.patients;

    return allPatients?.filter((patient: any) => {
      const query = searchQuery.toLowerCase();
      return (
        patient?.name?.toLowerCase().includes(query) ||
        patient?.surgery_name?.toLowerCase().includes(query) ||
        patient?.surgery_date?.toLowerCase().includes(query) ||
        patient?.last_activity?.date?.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery]);

  const sortedPatients = useMemo(() => {
    if (!filteredPatients) return [];

    return filteredPatients.slice().sort((a: any, b: any) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle last_activity sorting
      if (sortField === "last_activity" && aValue && bValue) {
        aValue = a.last_activity?.value || "";
        bValue = b.last_activity?.value || "";
      }

      // Handle date sorting for surgery_date or last_activity.value if it's a date
      if (sortField === "surgery_date" || (sortField === "last_activity" && dayjs(aValue).isValid())) {
        aValue = dayjs(aValue).valueOf();
        bValue = dayjs(bValue).valueOf();
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredPatients, sortField, sortOrder]);

  const convertToCSV = (array: any) => {
    const headers = [" Name", " Surgery", " Surgery Date", " Last Activity"];
    const rows = array.map((patient: any) => [
      patient.name ? `" ${patient.name}"` : '-',
      patient.surgery_name ? `" ${patient.surgery_name}"` : '-',
      patient.surgery_date ? `" ${patient.surgery_date}"` : '-',
      patient.last_activity?.date ? `" ${patient.last_activity.date}"` : '-', 
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e: any) => e.join(","))
    ].join("\n");

    return csvContent;
  };

  const [isLoading1, setIsLoading] = useState(false);

  const exportAllPatients = async () => {
    try {
      setIsLoading(true); // Start loading
  
      const token = await auth.getAccessToken();
      const { data, error } = await getAllPatientDetails(auth.sub, token);
  
      if (error) throw error;
  
      if (data?.length > 0) {
        const headers = [
          " Name", " Surgery Name", " Surgery Date",
          " Pro Type", " Score", " Due",
          " Target", " Completed Date"
        ] as const;
  
        const csvRows: string[] = [headers.join(",")];
  
        data?.forEach((patient: any) => {
          const { survey_data, ...patientInfo } = patient;
  
          // Create a row for patient info, persist name, surgery_name, and surgery_date in all rows
          survey_data.forEach((survey: any) => {
            const csvRow = {
              Name: patientInfo.name ? `" ${patientInfo.name}"` : '-',
              Surgery_Name: patientInfo.surgery_name ? `" ${patientInfo.surgery_name}"` : '-',
              Surgery_Date: patientInfo.surgery_date ? `" ${patientInfo.surgery_date}"` : '-',
              Pro_Type: survey.pro_type ? `" ${survey.pro_type}"` : '-',
              Score: survey.score ? `" ${survey.score}"` : '-',
              Due: survey.due ? `" ${survey.due}"` : '-',
              Target: survey.target?.target ? `" ${survey.target.target}"` : '-',
              Completed_Date: survey.completed?.date ? `" ${survey.completed.date}"` : '-',
            };
  
            csvRows.push(Object.values(csvRow).join(","));
          });
        });
  
        const csvContent = csvRows.join("\n");
  
        const blob = new Blob([csvContent], { type: 'text/xlsx;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
  
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "all_patients_data.xlsx");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.warn("No data available to export.");
      }
    } catch (error) {
      console.error("Error exporting patients data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  
    
  const downloadCSV = (data: any) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/xlsx;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "patients_data.xlsx");
    link.style.visibility = 'hidden';
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

  const completedSurveys = data?.overall_patient_compliance_rate?.completed_survey || 0;
  const pendingSurveys = data?.overall_patient_compliance_rate?.pending_survey || 0;
  const overdueSurveys = data?.overall_patient_compliance_rate?.overdue_survey || 0;
  const totalSurveys = completedSurveys + pendingSurveys + overdueSurveys;

  const ChartData = [
    { value: completedSurveys, color: '#38B2AC', label: 'Completed' },
    { value: pendingSurveys, color: '#4299e1', label: 'Pending' },
    { value: overdueSurveys, color: '#F56565', label: 'Overdue' },
  ];

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box p={{ base: "0", md: "6" }}>
        <Box
          w="100%"
          h="max-content"
          borderRadius="9px"
        >
          <Flex direction={{ base: "column", lg: "row" }} justify="space-between">
            <Box w={{ base: "100%", lg: "50%" }}>
              <Text fontSize="20px" fontWeight="600" pb="5px" color={isLight ? 'black' : 'white'} align="left">
                Welcome {data?.name}
              </Text>
              <Text fontSize="17px" fontWeight="600" pb="10px" color={isLight ? 'black' : 'white'} align="left">
                {data?.total_patients} Patients
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
                    mr='2'
                    onClick={() => downloadCSV(sortedPatients)}
                    aria-label="Download CSV"
                  />
                </Box>
                <Box>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={exportAllPatients}
                    isLoading={isLoading1}
                    loadingText="Exporting"
                  >
                    Export All Patients Data
                  </Button>
                </Box>

              </Flex>
            </Box>

            <Box w={{ base: "100%", lg: "50%" }} borderRadius="9px">
              {/* <Flex direction="row" justifyContent="right" alignItems="center" wrap="nowrap">
                <Box width={{ base: "40%", md: "25%" }} textAlign="center" mr={{ base: '10px', md: '0px' }}>
                  <HomePie data={ChartData} showLabels={false} />
                </Box>
                <Box textAlign="left">
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
              </Flex> */}

              <Flex direction="row" justifyContent={{ base: 'center', md: 'right' }} alignItems="center" wrap="nowrap">
                <Box mb={{ base: '10px' }} width={{ base: "40%", md: "25%" }} textAlign="center" mr={{ base: '10px', md: '0px' }}>
                  <HomePie data={ChartData} showLabels={false} />
                </Box>
                <Box textAlign="left">
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
        <Box>

          <Box
            w="100%"
            h="max-content"
            boxShadow="0px 0px 6px 2px #c3c3c333"
            mb="20px"
            borderRadius="9px"
            p={{ md: '15px' }}
            bg={isLight ? "white" : "gray.700"}
          >
            <TableContainer whiteSpace="normal">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th
                      p={{ base: '10px 5px 10px 3px', md: '10px 10px 15px 20px' }}
                      onClick={() => handleSort("name")}
                      cursor="pointer"
                      borderBottom='1px solid #f8f4ff !important'
                    >
                      <Text fontSize='15px' fontWeight="700" color={isLight ? 'black' : 'white'} align="left">
                        Name {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                      </Text>
                    </Th>
                    <Th
                      p={{ base: '10px 5px', md: '10px 10px 15px 20px' }}
                      onClick={() => handleSort("surgery_name")}
                      cursor="pointer"
                      borderBottom='1px solid #f8f4ff !important'
                    >
                      <Text fontSize='15px' fontWeight="700" color={isLight ? 'black' : 'white'} align="left">
                        Surgery {sortField === "surgery_name" && (sortOrder === "asc" ? "▲" : "▼")}
                      </Text>
                    </Th>
                    <Th
                      p={{ base: '10px 5px', md: '10px 10px 15px 20px' }}
                      onClick={() => handleSort("surgery_date")}
                      cursor="pointer"
                      borderBottom='1px solid #f8f4ff !important'
                    >
                      <Text fontSize='15px' fontWeight="700" color={isLight ? 'black' : 'white'} align="left">
                        Surgery Date {sortField === "surgery_date" && (sortOrder === "asc" ? "▲" : "▼")}
                      </Text>
                    </Th>
                    <Th
                      p={{ base: '10px 5px', md: '10px 10px 15px 20px' }}
                      onClick={() => handleSort("last_activity")}
                      cursor="pointer"
                      borderBottom='1px solid #f8f4ff !important'
                    >
                      <Text fontSize='15px' fontWeight="700" color={isLight ? 'black' : 'white'} align="left">
                        Last Activity {sortField === "last_activity" && (sortOrder === "asc" ? "▲" : "▼")}
                      </Text>
                    </Th>
                    <Th
                      borderBottom='1px solid #f8f4ff !important'
                    ></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {sortedPatients.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} borderBottom="none">
                        <Text align="center" color={isLight ? 'black' : 'white'} fontSize='15px'>
                          No data found
                        </Text>
                      </Td>
                    </Tr>
                  ) : (
                    sortedPatients.map((patient: any, index: any) => {
                      const surgeryDate = dayjs(patient.surgery_date);
                      const isPastDate = surgeryDate.isBefore(dayjs(), 'day');
                      return (
                        <Tr
                          key={index}
                          onClick={() => navigate(`/patient-details/${patient.sub}`)}
                          cursor="pointer"
                          bg={(isPastDate && isLight) ? '#eaeaea' : isPastDate ? '#4c6081' : ''}

                        >
                          <Td p={{ base: '13px 5px', md: '20px' }} borderBottom="none">
                            <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal" fontSize='15px'>
                              {patient?.name || '-'}
                            </Text>
                          </Td>
                          <Td p={{ base: '13px 5px', md: '20px' }} borderBottom="none">
                            <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal" fontSize='15px'>
                              {patient?.surgery_name || '-'}
                            </Text>
                          </Td>
                          <Td p={{ base: '13px 5px', md: '20px' }} borderBottom="none">
                            <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal" fontSize='15px'>
                              {patient?.surgery_date || '-'}
                            </Text>
                          </Td>
                          <Td p={{ base: '13px 5px', md: '20px' }} borderBottom="none">
                            <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal" fontSize='15px'>
                              {patient?.last_activity?.date || '-'}
                            </Text>
                          </Td>
                          <Td p={{ base: '13px 5px', md: '20px' }} borderBottom="none">
                            <Text align="left" color={isLight ? 'black' : (isPastDate && isLight) ? 'white' : 'white'} fontWeight="normal" fontSize='15px'>
                              &gt;
                            </Text>
                          </Td>
                        </Tr>
                      );
                    })
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
