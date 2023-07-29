import { NavLink as RouterLink } from 'react-router-dom';
import { Container, Heading, Stack, Text, Button, useColorMode } from '@chakra-ui/react';

import { PageLayout } from '../components/page-layout';

export function Registered() {
  const { colorMode } = useColorMode();
  
  return (
    <PageLayout>
      <Container maxW="5xl">
        <Stack
          textAlign="center"
          align="center"
          spacing={{ base: 8, md: 10 }}
          py="16"
        >
          {/* Heading text */}
          <Heading
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
            lineHeight="130%"
            maxW="3xl"
            color={colorMode === "light" ? "black" : "white"}
          >
            Welcome to the start of your{' '}
            <Text as="span" color="orange.400">
              recovery journey.
            </Text>
          </Heading>

          {/* Secondary text */}
          <Text
            fontWeight={500}
            fontSize={{ base: 'lg', sm: '2xl' }}
            color="gray.500"
            maxW="3xl"
          >
            Log in to your account to get started today.
          </Text>

          {/* Login button */}
          <Stack spacing={6} direction={'row'}>
            <Button
              colorScheme="orange"
              bg="orange.400"
              _hover={{ bg: 'orange.500' }}
              rounded="full"
              px={12}
              as={RouterLink}
              size="lg"
              to="/signin"
            >
              Login
            </Button>
          </Stack>
        </Stack>
      </Container>
    </PageLayout>
  );
}
