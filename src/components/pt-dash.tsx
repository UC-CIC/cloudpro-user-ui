import {
    Flex,
    Stack,
    Container,
    Text,
    Button
  } from "@chakra-ui/react";
  
  import { useAuth } from "../hooks/useAuth";

  export const PtDash = () => {
    const auth = useAuth();

    
    return (
      <Container maxW={"5xl"}>
        <Stack
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            justifyContent="top"
            alignItems="center"
            display="flex"
          >
            <Stack flexDir="column" mb="2" alignItems="center">

                    <Text fontSize="5xl">Welcome</Text>
                    <Text fontSize="4xl">Login Succeed; profile is setup 🎉</Text>
                    <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={() => auth.signOut()}
                    >
                    Log out
                    </Button>

            </Stack>
          </Flex>
        </Stack>
      </Container>
    );
  };
  