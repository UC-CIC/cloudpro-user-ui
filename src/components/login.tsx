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
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";

import { useAuth } from "../hooks/useAuth";
import { useNavigate, NavLink as RouterLink } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const LoginFlow = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [showGetCode, setShowGetCode] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleShowOTPClick = () => setShowOTP(!showOTP);

  const [alttfa, setAltTfa] = useState(false);

  const executeGetCode = async (event: React.FormEvent<HTMLFormElement>)  => {
    event.preventDefault();
    console.log("<execute_getcode>");
    const result = await auth.getChallenge(email);
    if (result.success) {
        setShowGetCode(true);
    } else {
        alert(result.message);
    }
  };
  const executeVerify = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("<execute_verify>");
    const result = await auth.signIn(code);
    if (result.success) {
        navigate({ pathname: "/pt-authed-landing" });
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
            <form noValidate onSubmit={showGetCode? executeVerify : executeGetCode }>
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
                      {showGetCode ? (
                        ""
                      ) : (
                        <Button
                          type="submit"
                          h="1.75rem"
                          size="sm"
                        >
                          Get Code
                        </Button>
                      )}
                    </InputRightElement>
                  </InputGroup>
       
                </FormControl>
                {showGetCode ? (
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
                        <Button h="1.75rem" size="sm" onClick={handleShowOTPClick}>
                          {showOTP ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText textAlign="center">
                      <Link>resend code</Link><br></br>
                      <Link onClick={() => setAltTfa(!alttfa)}>try a different method?</Link>
                    </FormHelperText>
                    {alttfa === true ?
                    <Box>
                    <Button h="1.75rem" size="sm" >
                          email
                        </Button> 
                                            <Button h="1.75rem" size="sm" >
                                            sms
                                          </Button>   
                                                              <Button h="1.75rem" size="sm" >
                                                              call
                                                            </Button> </Box>      
                        : "" }         
                  </FormControl>
                )}
                {!showGetCode ? (
                  ""
                ) : (
                  <Button
                    borderRadius={0}
                    type="submit"
                    variant="solid"
                    colorScheme="teal"
                    width="full"
                  >
                    Login
                  </Button>
                )}
              </Stack>
            </form>
          </Box>
        </Stack>
        <Box>
          No account?{" "}
          <Link color="teal.500" href="#"             
            as={RouterLink}
            to="/register">
            Register
          </Link>
        </Box>
      </Flex>
    

      </Stack>
    </Container>
  );
};
