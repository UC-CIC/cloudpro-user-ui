import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Progress,
  Text,
} from '@chakra-ui/react';

export interface Props {
  hospital: string;
  surgeon: string;
  surgeryDate: string;
}

export const SurgeryInfo: React.FC<Props> = ({
  hospital,
  surgeon,
  surgeryDate,
}) => {
  // Calculate the number of months left for the observation period
  const monthsLeft = useMemo(() => {
    // Determine the end date
    const endDate = new Date(surgeryDate);
    endDate.setMonth(endDate.getMonth() + 11);
    // Calculate the remaining number of months
    const today = new Date();
    return (
      (endDate.getFullYear() - today.getFullYear()) * 12 -
      today.getMonth() +
      endDate.getMonth()
    );
  }, [surgeryDate]);

  return (
    <Card overflow="hidden" minW="400px" borderRadius="lg" bgColor="gray.50">
      <CardHeader py="4" backgroundColor="teal">
        <Heading fontSize="2xl" color="white">
          Your Surgery
        </Heading>
      </CardHeader>

      <CardBody py="6">
        <Box maxW="lg" pb="4">
          <SurgeryInfoDetail label="Operation Date" text={surgeryDate} />
          <SurgeryInfoDetail label="Hospital" text={hospital.split(";")[1]} />
          <SurgeryInfoDetail label="Surgeon" text={surgeon.split(";")[1]} />
        </Box>
        <Divider borderColor="gray.300" />
        <Box px="8" pt="4">
          <Text mb="2" fontSize="sm">
            {monthsLeft} months of observation remain
          </Text>
          <Progress
            colorScheme="blue"
            value={(Math.max(0, 12 - monthsLeft) / 12) * 100}
          />
        </Box>
      </CardBody>
    </Card>
  );
};

type DetailProps = {
  label: string;
  text: string;
};

const SurgeryInfoDetail: React.FC<DetailProps> = ({ label, text }) => (
  <HStack spacing="6" alignItems="start">
    <Box w="12rem" minH="8">
      <Text align="left">{label}:</Text>
    </Box>
    <Box w="100%" minH="8">
      <Text align="left" fontWeight="normal">
        {text}
      </Text>
    </Box>
  </HStack>
);

export default SurgeryInfo;
