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
  FormErrorMessage,
  Select,
  Text
} from "@chakra-ui/react";
import { updateProfile } from "../services/message.service";
import { useNavigate } from "react-router-dom";

export interface Props {
    uid: string;
    profile: any;
}

export const ProfileSetup: React.FC<Props> = (props) => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

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

  const [state, setState] = useState("");

  const [formsubbed, setFormSubbed] = useState(false);

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

    setState(props.profile.state ?? "");

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

        props.profile.tfa,
        props.profile.state
    ]);

  const executeProfileSetup = async (event: React.FormEvent<HTMLFormElement>)  => {
    event.preventDefault();

    if( checkForm(3) !== false ){
      setFormSubbed(false);
      return
    }

    setFormSubbed(true);
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
    const { data, error } = await updateProfile(profile_payload);
    console.log(data);
    console.log(error);

    navigate(0);
    
  }


  const [firstname_isError, setFirstnameError] = useState(false);
  const firstname_error_msg ="First name is a required field."
  const [lastname_isError, setLastnameError] = useState(false);
  const lastname_error_msg ="Last name is a required field."

  const [birthsex_isError, setBirthSexError] = useState(false);
  const birthsex_error_msg ="Birth Sex is a required field."

  const [phone_isError, setPhoneError] = useState(false);
  const phone_error_msg ="Phone is a required field. Use a valid phone number format. Ex: +1-444-333-2383"

  const [hospital_isError, setHospitalError] = useState(false);
  const hospital_error_msg ="Hopital is a required field."

  const [surgeon_isError, setSurgeonError] = useState(false);
  const surgeon_error_msg ="Surgeon is a required field."

  const [bday_isError, setBdayError] = useState(false);
  const bday_error_msg ="Birth Date is a required field."

  const [surgerydate_isError, setSurgeryDateError] = useState(false);
  const surgerydate_error_msg ="Surgery Date is a required field."

  const [c1q_isError, setC1qError] = useState(false);
  const c1q_error_msg ="Please select your first challenge question."
  const [c1a_isError, setC1aError] = useState(false);
  const c1a_error_msg ="Please select your first challenge answer."

  const [c2q_isError, setC2qError] = useState(false);
  const c2q_error_msg ="Please select your second challenge question."
  const [c2a_isError, setC2aError] = useState(false);
  const c2a_error_msg ="Please select your second challenge answer."

  const [c3q_isError, setC3qError] = useState(false);
  const c3q_error_msg ="Please select your third challenge question"
  const [c3a_isError, setC3aError] = useState(false);
  const c3a_error_msg ="Please select your third challenge answer"

  const [tfa_isError, setTfaError] = useState(false);
  const tfa_error_msg ="You must select a default two factor device."


  const validator_dataNotNull = ( data:string ) => {
    return (data !== "")
  }

  const validator_phoneFormat = ( data:string ) => {
    // eslint-disable-next-line
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    
    console.log("REGEX: ", re.exec(data));

    return re.exec(data);
  }


  const checkForm = ( go_to_step:number ) => {
    var errors=false;

    switch (step) {
      case 1:
        if( !validator_dataNotNull(firstname) ) {
          setFirstnameError( true )
          errors=true;
        } 
        else {
          setFirstnameError( false )
        }
        if( !validator_dataNotNull(lastname) ) {
          setLastnameError( true )
          errors=true;
        } 
        else {
          setLastnameError( false )
        }
        if( !validator_dataNotNull(birthsex) ) {
          setBirthSexError( true )
          errors=true;
        } 
        else {
          setBirthSexError( false )
        }
        if( !validator_dataNotNull(phone) || !validator_phoneFormat(phone) ) {
          setPhoneError( true )
          errors=true;
        } 
        else {
          setPhoneError( false )
        }
        if( !validator_dataNotNull(hospital) ) {
          setHospitalError( true )
          errors=true;
        } 
        else {
          setHospitalError( false )
        }
        if( !validator_dataNotNull(surgeon) ) {
          setSurgeonError( true )
          errors=true;
        } 
        else {
          setSurgeonError( false )
        }
        if( !validator_dataNotNull(bday) ) {
          setBdayError( true )
          errors=true;
        } 
        else {
          setBdayError( false )
        }
        if( !validator_dataNotNull(surgerydate) ) {
          setSurgeryDateError( true )
          errors=true;
        } 
        else {
          setSurgeryDateError( false )
        }
        break;
      case 2:
        if( !validator_dataNotNull(c1q) ) {
          setC1qError( true )
          errors=true;
        } 
        else {
          setC1qError( false )
        }
        if( !validator_dataNotNull(c1a) ) {
          setC1aError( true )
          errors=true;
        } 
        else {
          setC1aError( false )
        }

        if( !validator_dataNotNull(c2q) ) {
          setC2qError( true )
          errors=true;
        } 
        else {
          setC2qError( false )
        }
        if( !validator_dataNotNull(c2a) ) {
          setC2aError( true )
          errors=true;
        } 
        else {
          setC2aError( false )
        }

        if( !validator_dataNotNull(c3q) ) {
          setC3qError( true )
          errors=true;
        } 
        else {
          setC3qError( false )
        }
        if( !validator_dataNotNull(c3a) ) {
          setC3aError( true )
          errors=true;
        } 
        else {
          setC3aError( false )
        }
        break;
      case 3:
        if( !validator_dataNotNull(tfa) ) {
          setTfaError( true )
          errors=true;
        } 
        else {
          setTfaError( false )
        }       
        break;
    }

    if( errors === false ) { setStep(go_to_step) }

    return errors
  }

  const setField = (setter:Function,field_error:Function, value:string) => {
    setter(value);
    field_error(false);
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
            <Heading color="teal.400"> 
              {state==="INIT" ? "Profile Setup" : "Profile Confirmation"}  ({step}/3)
            </Heading>

            <Box minW={{ base: "90%", md: "468px" }}>
              {state==="INIT" ? "" : 
              <Box bg='CadetBlue' w='100%' p={4} color='white'>
                <Text fontSize='sm'>Congrats! Staff have already set your profile up and you are ready to go.<br/> Please confirm your information on the following screens </Text>               
              </Box>  
              }
              <form noValidate onSubmit={executeProfileSetup}>
                <Stack spacing={4} p="1rem" boxShadow="md">
                { step === 1 ?
                <Box>
                   <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="text" disabled value={props.uid} />
                  </FormControl>

                  <FormControl isInvalid={firstname_isError}>
                    <FormLabel>First Name</FormLabel>
                    
                    <Input type="text" placeholder="" value={firstname}  onChange={(e) => setField(setFirstName,setFirstnameError,e.target.value)}/>
                    { firstname_isError ?
                      <FormErrorMessage>{firstname_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  <FormControl isInvalid={lastname_isError}>
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" placeholder="" value={lastname}  onChange={(e) => setField(setLastName,setLastnameError,e.target.value)}/>
                    { lastname_isError ?
                      <FormErrorMessage>{lastname_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>

                  <InputGroup>
                    <FormControl isInvalid={bday_isError}>
                      <FormLabel>Birth Date</FormLabel>
                      <Input type="date" placeholder="" value={bday}  onChange={(e) => setField(setBday,setBdayError,e.target.value)} />
                      { bday_isError ?
                      <FormErrorMessage>{bday_error_msg}</FormErrorMessage>
                      : ""
                      }
                    </FormControl>
                    <FormControl isInvalid={birthsex_isError}>
                      <FormLabel>Birth Sex</FormLabel>
                      <Select placeholder="Select option"  value={birthsex} onChange={(e) => setField(setBirthSex,setBirthSexError,e.target.value)}>
                        <option value="bs_m">Male</option>
                        <option value="bs_f">Female</option>
                      </Select>
                      { birthsex_isError ?
                      <FormErrorMessage>{birthsex_error_msg}</FormErrorMessage>
                      : ""
                      }
                    </FormControl>
                  </InputGroup>

                  <FormControl isInvalid={phone_isError}>
                    <FormLabel>Phone</FormLabel>
                    <Input type="tel" placeholder=""  value={phone}  onChange={(e) => setField(setPhone,setPhoneError,e.target.value)}/>
                    { phone_isError ?
                      <FormErrorMessage>{phone_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  <FormControl isInvalid={hospital_isError}>
                    <FormLabel>Hospital</FormLabel>
                    <Select placeholder="Select option" value={hospital} onChange={(e) => setField(setHospital,setHospitalError,e.target.value)}>
                      <option value="h1">H 1</option>
                      <option value="h2">H 2</option>
                      <option value="h3">H 3</option>
                    </Select>
                    { hospital_isError ?
                      <FormErrorMessage>{hospital_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  <FormControl isInvalid={surgeon_isError}>
                    <FormLabel>Surgeon</FormLabel>
                    <Select placeholder="Select option" value={surgeon} onChange={(e) => setField(setSurgeon,setSurgeonError,e.target.value)}>
                      <option value="s1">S 1</option>
                      <option value="s2">S 2</option>
                      <option value="s3">S 3</option>
                    </Select>
                    { surgeon_isError ?
                      <FormErrorMessage>{surgeon_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  <FormControl isInvalid={surgerydate_isError}>
                    <FormLabel>Surgery Date</FormLabel>
                    <Input type="date" placeholder=""  value={surgerydate}  onChange={(e) => setField(setSurgeryDate,setSurgeryDateError,e.target.value)} />
                    { surgerydate_isError ?
                      <FormErrorMessage>{surgerydate_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  </Box>
                  : "" }
                  { step === 2 ?
                  <Box>
                  <FormControl isInvalid={c1q_isError}>
                    <FormLabel>Challenge Q1</FormLabel>
                    <Select placeholder="Select option" value={c1q} onChange={(e) => setField(setC1q,setC1qError,e.target.value)}>
                      <option value="c1q_a">What is your favorite name?</option>
                      <option value="c1q_b">What is your favorite website?</option>
                      <option value="c1q_c">What is your favorite game?</option>
                    </Select>
                    { c1q_isError ?
                      <FormErrorMessage>{c1q_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  <FormControl isInvalid={c1a_isError}>
                    <FormLabel>Q1 Answer</FormLabel>
                    <Input type="text" placeholder="" value={c1a}  onChange={(e) => setField(setC1a,setC1aError,e.target.value)}/>
                    { c1a_isError ?
                      <FormErrorMessage>{c1a_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  <FormControl isInvalid={c2q_isError}>
                    <FormLabel>Challenge Q2</FormLabel>
                    <Select placeholder="Select option" value={c2q} onChange={(e) => setField(setC2q,setC2qError,e.target.value)}>
                      <option value="c2q_a">What is your favorite name?</option>
                      <option value="c2q_b">What is your favorite website?</option>
                      <option value="c2q_c">What is your favorite game?</option>
                    </Select>
                    { c2q_isError ?
                      <FormErrorMessage>{c2q_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  <FormControl isInvalid={c2a_isError}>
                    <FormLabel>Q2 Answer</FormLabel>
                    <Input type="text" placeholder="" value={c2a}  onChange={(e) => setField(setC2a,setC2aError,e.target.value)}/>
                    { c2a_isError ?
                      <FormErrorMessage>{c2a_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  <FormControl isInvalid={c3q_isError}>
                    <FormLabel>Challenge Q3</FormLabel>
                    <Select placeholder="Select option" value={c3q} onChange={(e) => setField(setC3q,setC3qError,e.target.value)}>
                      <option value="c3q_a">What is your favorite name?</option>
                      <option value="c3q_b">What is your favorite website?</option>
                      <option value="c3q_c">What is your favorite game?</option>
                    </Select>
                    { c3q_isError ?
                      <FormErrorMessage>{c3q_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  <FormControl isInvalid={c3a_isError}>
                    <FormLabel>Q3 Answer</FormLabel>
                    <Input type="text" placeholder="" value={c3a}  onChange={(e) => setField(setC3a,setC3aError,e.target.value)}/>
                    { c3a_isError ?
                      <FormErrorMessage>{c3a_error_msg}</FormErrorMessage>
                      : ""
                    }
                  </FormControl>
                  </Box>
                  : "" }
                { step === 3 ?
                <Box>
                 <Box  fontSize='sm' bg='CadetBlue' p={4} color='white'>
                  CloudPRO simplifies your life by defaulting to passwordless authentication. <br/>This allows for a unique code to be sent to you each time you login to identify you. <br/>We support three methods of this code being sent, email, SMS, or a phone call. <br/>Let us know your default preference!
                </Box>   
                  <FormControl isInvalid={tfa_isError}>
                    
                    <FormLabel>Preferred 2fa</FormLabel>
                    <Select placeholder="Select option" value={tfa}  onChange={(e) => setField(setTfa,setTfaError,e.target.value)}>
                      <option value="tfa_email">Email</option>
                      <option value="tfa_sms" disabled>SMS</option>
                      <option value="tfa_call" disabled>Call</option>
                    </Select>
                    { tfa_isError ?
                      <FormErrorMessage>{tfa_error_msg}</FormErrorMessage>
                      : ""
                    }
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
                        disabled={formsubbed}
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
                        onClick={() => checkForm(step+1) }
                      >
                        Next
                      </Button>
                    ) : ""}

                    {step === 3 ? 
                      <Button borderRadius={0} colorScheme="teal" width="full" type="submit" disabled={formsubbed}>
                        Complete
                      </Button>
                      : ""}                   
                  </InputGroup>
                  {formsubbed === true ? 
                     <Box bg='CadetBlue' w='100%' p={4} color='white'>
                    Processing 
                    </Box>  
                      : ""}
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
};
