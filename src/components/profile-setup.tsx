import React, { useState,useEffect } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  Container,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";


export interface Props {
    uid: string;
    profile: any;
}

export const ProfileSetup: React.FC<Props> = (props) => {
  const [step, setStep] = useState(1);

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [bday, setBday] = useState("");
  const [birthsex, setBirthSex] = useState("");
  const [phone, setPhone] = useState("");
  const [hospital, setHospital] = useState("");
  const [surgeon, setSurgeon] = useState("");
  const [surgerydate, setSurgeryDate] = useState("");

  const [c1q, setC1q] = useState("");
  const [c1a, setC1a] = useState("");
  const [c2q, setC2q] = useState("");
  const [c2a, setC2a] = useState("");
  const [c3q, setC3q] = useState("");
  const [c3a, setC3a] = useState("");

  const [tfa, setTfa] = useState("");


  useEffect(() => {
    console.log("<profile-setup use effect>");

    let isMounted = true;

    if (!isMounted ) {
    return;
    }


    setFirstName(props.profile.profile.first_name ?? "");
    setLastName(props.profile.profile.last_name ?? "");
    setBday(props.profile.profile.birth_date ?? "")
    setBirthSex(props.profile.profile.birth_sex ?? "")
    setPhone(props.profile.profile.phone ?? "");
    setHospital(props.profile.profile.hospital ?? "");
    setSurgeon(props.profile.profile.surgeon ?? "");
    setSurgeryDate(props.profile.profile.surgery_date ?? "");

    setC1q(props.profile.challenge.c1q ?? "");
    setC1a(props.profile.challenge.c1a ?? "");
    setC2q(props.profile.challenge.c2q ?? "");
    setC2a(props.profile.challenge.c2a ?? "");
    setC3q(props.profile.challenge.c3q ?? "");
    setC3a(props.profile.challenge.c3a ?? "");
    
    setTfa(props.profile.tfa ?? "");

    return () => {
        isMounted = false;
    };
    
  }, [
        props.profile.profile.first_name,
        props.profile.profile.last_name,
        props.profile.profile.birth_date,
        props.profile.profile.birth_sex,
        props.profile.profile.phone,
        props.profile.profile.hospital,
        props.profile.profile.surgeon,
        props.profile.profile.surgery_date,

        props.profile.challenge.c1q,
        props.profile.challenge.c1a,
        props.profile.challenge.c2q,
        props.profile.challenge.c2a,
        props.profile.challenge.c3q,
        props.profile.challenge.c3a,

        props.profile.tfa
    ]);

  const executeProfileSetup = async (event: React.FormEvent<HTMLFormElement>)  => {
    event.preventDefault();

    var profile_payload = {
        email: props.uid,
        state: "COMPLETE",
        tfa: tfa,
        profile: {
            first_name:firstname,
            last_name:lastname,
            birth_date:bday,
            birth_sex:birthsex,
            phone:phone,
            hospital:hospital,
            surgeon:surgeon,
            surgery_date:surgerydate
        },
        challenge: {
            c1q:c1q,
            c1a:c1a,
            c2q:c2q,
            c2a:c2a,
            c3q:c3q,
            c3a:c3a,
        }
    }
    /* build out profile payload */
    console.log(profile_payload)
    
    return
  }

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
            <Heading color="teal.400">Profile Setup ({step}/3)</Heading>
            <Box minW={{ base: "90%", md: "468px" }}>
              <form noValidate onSubmit={executeProfileSetup}>
                <Stack spacing={4} p="1rem" boxShadow="md">
                { step === 1 ?
                <Box>
                   <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="text" disabled value={props.uid} />
                  </FormControl>

                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input type="text" placeholder="" value={firstname}  onChange={(e) => setFirstName(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" placeholder="" value={lastname}  onChange={(e) => setLastName(e.target.value)}/>
                  </FormControl>

                  <InputGroup>
                    <FormControl>
                      <FormLabel>Birth Date</FormLabel>
                      <Input type="date" placeholder="" value={bday}  onChange={(e) => setBday(e.target.value)} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Birth Sex</FormLabel>
                      <Select placeholder="Select option"  value={birthsex} onChange={(e) => setBirthSex(e.target.value)}>
                        <option value="bs_m">Male</option>
                        <option value="bs_f">Female</option>
                      </Select>
                    </FormControl>
                  </InputGroup>

                  <FormControl>
                    <FormLabel>Phone</FormLabel>
                    <Input type="tel" placeholder=""  value={phone}  onChange={(e) => setPhone(e.target.value)}/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Hospital</FormLabel>
                    <Select placeholder="Select option" value={hospital} onChange={(e) => setHospital(e.target.value)}>
                      <option value="h1">H 1</option>
                      <option value="h2">H 2</option>
                      <option value="h3">H 3</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Surgeon</FormLabel>
                    <Select placeholder="Select option" value={surgeon} onChange={(e) => setSurgeon(e.target.value)}>
                      <option value="s1">S 1</option>
                      <option value="s2">S 2</option>
                      <option value="s3">S 3</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Surgery Date</FormLabel>
                    <Input type="date" placeholder=""  value={surgerydate}  onChange={(e) => setSurgeryDate(e.target.value)} />
                  </FormControl>
                  </Box>
                  : "" }
                  { step === 2 ?
                  <Box>
                  <FormControl>
                    <FormLabel>Challenge Q1</FormLabel>
                    <Select placeholder="Select option" value={c1q} onChange={(e) => setC1q(e.target.value)}>
                      <option value="c1q_a">What is your favorite name?</option>
                      <option value="c1q_b">What is your favorite website?</option>
                      <option value="c1q_c">What is your favorite game?</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Q1 Answer</FormLabel>
                    <Input type="text" placeholder="" value={c1a}  onChange={(e) => setC1a(e.target.value)}/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Challenge Q2</FormLabel>
                    <Select placeholder="Select option" value={c2q} onChange={(e) => setC2q(e.target.value)}>
                      <option value="c2q_a">What is your favorite name?</option>
                      <option value="c2q_b">What is your favorite website?</option>
                      <option value="c2q_c">What is your favorite game?</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Q2 Answer</FormLabel>
                    <Input type="text" placeholder="" value={c2a}  onChange={(e) => setC2a(e.target.value)}/>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Challenge Q3</FormLabel>
                    <Select placeholder="Select option" value={c3q} onChange={(e) => setC3q(e.target.value)}>
                      <option value="c3q_a">What is your favorite name?</option>
                      <option value="c3q_b">What is your favorite website?</option>
                      <option value="c3q_c">What is your favorite game?</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Q3 Answer</FormLabel>
                    <Input type="text" placeholder="" value={c3a}  onChange={(e) => setC3a(e.target.value)}/>
                  </FormControl>
                  </Box>
                  : "" }
                { step === 3 ?
                <Box>
                 <Box bg='CadetBlue' w='100%' p={4} color='white'>
                  CloudPRO simplifies your life by defaulting to passwordless authentication. This allows for a unique code to be sent to you each time you login to identify you. We support three methods of this code being sent, email, SMS, or a phone call. Let us know your default preference!
                </Box>   
                  <FormControl>
                    <FormLabel>Preferred 2fa</FormLabel>
                    <Select placeholder="Select option" value={tfa}  onChange={(e) => setTfa(e.target.value)}>
                      <option value="tfa_email">Email</option>
                      <option value="tfa_sms" disabled>SMS</option>
                      <option value="tfa_call" disabled>Call</option>
                    </Select>
                  </FormControl>
                </Box>
                  : "" }
                  <InputGroup>
                    {step > 1 ? (
                      <Button
                        borderRadius={0}
                        variant="solid"
                        colorScheme="teal"
                        width="full"
                        onClick={() => setStep(step - 1)}
                      >
                        Back
                      </Button>
                    ) : (
                      ""
                    )}
                    {step < 3 ? (
                      <Button
                        borderRadius={0}
                        colorScheme="teal"
                        width="full"
                        onClick={() => setStep(step + 1)}
                      >
                        Next
                      </Button>
                    ) : ""}

                    {step === 3 ? 
                      <Button borderRadius={0} colorScheme="teal" width="full" type="submit" >
                        Complete
                      </Button>
                      : ""}
                    
                  </InputGroup>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
};
