// import { Text, VStack } from '@chakra-ui/react';

// import React from 'react';

// export const Surgeon: React.FC = () => {
//   return (
//     <VStack h={500} justify="center" spacing={8}>
//       <Text fontSize="5xl">Welcome</Text>
//       <Text fontSize="4xl">I am Surgeon 👩‍⚕️</Text>
//     </VStack>
//   );
// };

import React from "react";
import { PageLayout } from "../components/page-layout";
import { Container, Stack } from "@chakra-ui/react";
import { SrgnTab } from "../components/srgndash/srgn-tab"

export const Surgeon: React.FC = () => {
  return (
    <PageLayout>
      <Container p={{ base: '0px 5px 0px 0px' }} maxW={"7xl"}>
        <Stack>

          <SrgnTab />

        </Stack>
      </Container>
    </PageLayout>
  );
};
