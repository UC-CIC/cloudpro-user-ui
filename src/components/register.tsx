import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Container,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  HStack
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";

import { useAuth } from "../hooks/useAuth";
import { useNavigate, NavLink as RouterLink } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const RegisterFlow = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleShowClick = () => setShowOTP(!showOTP);
  const handleShowRegisterClick = () => setShowRegister(!showRegister);


  const executeRegister = async (event: React.FormEvent<HTMLFormElement>)  => {
    event.preventDefault();
    const result = await auth.signUp(email);
    if (result.success) {
        setShowRegister(true);
    } else {
        alert(result.message);
    }
  };
  const executeVerify = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await auth.verify(email,code);
    if (result.success) {
        navigate({ pathname: "/" });
    } else {
        alert(result.message);
    }
    
};

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
        <Stack
          flexDir="column"
          mb="2"
          
          alignItems="center"
        >
          <Avatar bg="teal.500" />
          <Heading color="teal.400">Welcome</Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form noValidate onSubmit={showRegister? executeVerify : executeRegister }>
              <Stack spacing={4} p="1rem" boxShadow="md">
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input 
                        type="email" 
                        placeholder="email address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <InputRightElement width="4.5rem">
                      {showRegister ? (
                        ""
                      ) : (
                        <Button
                          type="submit"
                          h="1.75rem"
                          size="sm"
                        >
                          Register
                        </Button>
                      )}
                    </InputRightElement>
                  </InputGroup>
                  {showRegister ? (
                    ""
                  ) : (
                    <FormHelperText textAlign="right">
                      <Link onClick={handleShowRegisterClick}>
                        already have a code?
                      </Link>
                    </FormHelperText>
                  )}
                </FormControl>
                {!showRegister ? (
                  ""
                ) : (
                  <FormControl>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.300"
                        children={<CFaLock color="gray.300" />}
                      />
                      <Input
                        type={showOTP ? "text" : "password"}
                        placeholder="OTP Code"
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                      />

                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                          {showOTP ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText textAlign="right">
                      <Link>resend code</Link>
                    </FormHelperText>
                  </FormControl>
                )}
                {!showRegister ? (
                  ""
                ) : (
                  <Button
                    borderRadius={0}
                    type="submit"
                    variant="solid"
                    colorScheme="teal"
                    width="full"
                  >
                    Complete Registration
                  </Button>
                )}
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          Existing account?{" "}
          <Link color="teal.500" href="#"             
            as={RouterLink}
            to="/signin">
            Login
          </Link>
        </Box>
      </Flex>
    

      </Stack>
    </Container>
  );
};
