import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Link,
  Flex,
  Text,
  Container,
  Stack,
  Collapse,
  useColorMode,
} from "@chakra-ui/react";
import { PageLayout } from "../page-layout";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export const SurgeryDetails: React.FC = () => {
  const [isOpen1, setIsOpen1] = useState(true);

  const [isOpen, setIsOpen] = useState<{ [key: number]: boolean }>({});

  const toggleCollapse = (id: number) => {
    setIsOpen(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const details = [
    { id: 1, name: "Survey question, how do you feel 3 days post operation?", des: "Survey question answer..." },
    { id: 2, name: "Survey question, how do you feel 3 days post operation?", des: "Survey question answer..." },
    { id: 3, name: "Survey question, how do you feel 3 days post operation?", des: "Survey question answer..." },
  ];

  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";

  return (
    <PageLayout>
      <Container maxW={"7xl"}>
        <Stack spacing={6}>
          <Box p={{ base: '3', md: '6' }}>
            <Heading onClick={() => window.history.go(-1)} mb={6} fontWeight="400" fontSize="25px">
              <Link _hover={{ textDecoration: 'none' }} color={isLight ? "black" : "white"}>&lt; Home &lt; All Patients - Eleanor Shellstrop - 3 Days Post Surgery Survey</Link>
            </Heading>

            <Box
              w="100%"
              h="max-content"
              boxShadow="0px 0px 6px 2px #00000033"
              m="30px 0px"
              borderRadius="9px"
              p="20px 20px"
              bg={isLight ? "white" : "gray.700"}
            >
              <Heading
                onClick={() => setIsOpen1(!isOpen1)}
                fontSize="17px"
                color={isLight ? "black" : "white"}
              >
                Completed Surgery 6/25/2024
              </Heading>
              <Flex justifyContent="space-between" alignItems="center">
                <Text
                  fontWeight="600"
                  onClick={() => setIsOpen1(!isOpen1)}
                  p="10px 0px 0px 0px"
                  fontSize="md"
                  color={isLight ? "black" : "white"}
                >
                  Patient’s General Information
                </Text>
                <Box>
                  {isOpen1 ? (
                    <ChevronUpIcon fontSize="20px" />
                  ) : (
                    <ChevronDownIcon fontSize="20px" />
                  )}
                </Box>
              </Flex>
            </Box>

            <Box
              w="100%"
              boxShadow="0px 0px 6px 2px #00000033"
              m="30px 0px"
              borderRadius="9px"
              p="20px 20px"
              bg={isLight ? "white" : "gray.700"}
            >
              <Heading fontSize="17px" color={isLight ? "black" : "white"}>
                3 Days Post Surgery Survey
              </Heading>
              {details.map((item) => (
                <Box
                  key={item.id}
                  w="100%"
                  m="20px 0px"
                  borderRadius="9px"
                  p="10px"
                  bg={isLight ? "white" : "gray.600"}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={() => toggleCollapse(item.id)}
                    cursor="pointer"
                  >
                    <Text color="black" fontWeight="700" fontSize="md">
                      {item.id}. {item.name}
                    </Text>
                    <Box>
                      {isOpen[item.id] ? <ChevronUpIcon fontSize="20px" /> : <ChevronDownIcon fontSize="20px" />}
                    </Box>
                  </Flex>
                  <Collapse style={{ paddingLeft: '18px' }} in={!isOpen[item.id]} animateOpacity>
                    <Text fontWeight="600" mt={2}>
                      {item.des}
                    </Text>
                  </Collapse>
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </Container>
    </PageLayout>
  );
};

export default SurgeryDetails;
