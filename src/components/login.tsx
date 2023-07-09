import { useState } from 'react';
import {
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
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';

import { useAuth } from '../hooks/useAuth';
import { useNavigate, NavLink as RouterLink } from 'react-router-dom';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const LoginFlow = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [showGetCode, setShowGetCode] = useState(false);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleShowOTPClick = () => setShowOTP(!showOTP);

  const [alttfa, setAltTfa] = useState(false);

  const executeGetCode = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.SyntheticEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    const result = await auth.getChallenge(email);
    if (result.success) {
      setShowGetCode(true);
    } else {
      alert(result.message);
    }
  };
  const executeVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await auth.signIn(code);
    if (result.success) {
      navigate({ pathname: '/pt-authed-landing' });
    } else {
      alert(result.message);
    }
  };

  return (
    <Container maxW="5xl">
      <Stack
        textAlign="center"
        align="stretch"
        spacing={{ base: 6, md: 8 }}
        py={{ base: 20, md: 28 }}
      >
        {/* Login form */}
        <Stack flexDir="column" alignItems="center">
          <Avatar bg="teal.500" />
          <Heading color="teal.400">Welcome</Heading>
          <Box width="90%" maxWidth="486px">
            <form
              noValidate
              onSubmit={showGetCode ? executeVerify : executeGetCode}
            >
              <Stack spacing={4} p="1rem" boxShadow="md">
                {/* Email field */}
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
                    <InputRightElement width="5.5rem">
                      {showGetCode ? (
                        ''
                      ) : (
                        <Button type="submit" mr="2" h="1.75rem" size="sm">
                          Get Code
                        </Button>
                      )}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {/* OTP code handling */}
                {showGetCode && (
                  <FormControl>
                    {/* OTP code field */}
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.300"
                        children={<CFaLock color="gray.300" />}
                      />
                      <Input
                        type={showOTP ? 'text' : 'password'}
                        placeholder="OTP Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />

                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={handleShowOTPClick}
                        >
                          {showOTP ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>

                    {/* OTP resend / different method trigger */}
                    <Stack
                      pt="4"
                      spacing="2"
                      flexDir="column"
                      alignItems="center"
                    >
                      <Text
                        color="gray.600"
                        fontSize={{ base: 'md', sm: 'lg' }}
                      >
                        Not receiving your code?
                      </Text>
                      <Text fontSize={{ base: 'sm', sm: 'md' }}>
                        <Link color="teal.500" onClick={executeGetCode}>
                          Resend code
                        </Link>{' '}
                        or{' '}
                        <Link
                          color="teal.500"
                          onClick={() => setAltTfa(!alttfa)}
                        >
                          try a different method
                        </Link>
                        .
                      </Text>
                    </Stack>

                    {/* OTP alternative method options */}
                    {alttfa && (
                      <Box pt="4">
                        <Button h="1.75rem" size="sm">
                          email
                        </Button>
                        <Button mx="2" h="1.75rem" size="sm">
                          sms
                        </Button>
                        <Button h="1.75rem" size="sm">
                          call
                        </Button>{' '}
                      </Box>
                    )}
                  </FormControl>
                )}

                {/* Login button */}
                {showGetCode && (
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

        {/* Registration link */}
        <Box>
          No account?{' '}
          <Link color="teal.500" as={RouterLink} to="/register">
            Register
          </Link>
        </Box>
      </Stack>
    </Container>
  );
};
