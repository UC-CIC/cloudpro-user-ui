import React, { useEffect, useState } from "react";
import { PageLayout } from "../components/page-layout";
import { Container, Stack, Flex } from "@chakra-ui/react";
import { SrgnTab } from "../components/srgndash/srgn-tab" 

export const SurgeonTester: React.FC = () => {
  return (
    <PageLayout>
      <Container maxW={"5xl"}>
        <Stack
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          
          <SrgnTab/>


        </Stack>
      </Container>
    </PageLayout>
  );
};
