import { useAuth } from "../hooks/useAuth";
import PrivateRoute from "../components/PrivateRoute";
import React, { useEffect,useState } from "react";
import { getUserProfile } from "../services/message.service";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

export const PtAuthedLanding: React.FC = () => {
    const auth = useAuth();


    const [profile_state, setProfileState] = useState<string>("");
    const [profile, setProfile] = useState({});

    const getMessageUserProfile = async (email:string) => {
        const { data, error } = await getUserProfile(email);

        if (data) {
        }

        if (error) {
        }

        return data;
    };

    useEffect(() => {
        console.log("useEffect()");
        let isMounted = true;

        if (!isMounted || auth.username==="") {
        return;
        }
        console.log("Trying with: ", auth.username)
        const data=getMessageUserProfile(auth.username);

        data.then(svalue => { 
            let key:string = "state"
            let state:string = ""

            console.log("Svalue: ",svalue);

            if( svalue != null ){
                state = svalue[key];
                console.log("state: ",svalue);
                setProfileState(state);
                setProfile(svalue);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [auth]); 


    if (auth.isLoading) {
        return <Box />;
    }
    return (
        <PrivateRoute>
            <VStack h={500} justify="center" spacing={8}>
                    <Text fontSize="5xl">Welcome {auth.username}!!</Text>
                    <Text fontSize="5xl">State: {profile_state}</Text>
                    <Text fontSize="5xl">Payload: {JSON.stringify(profile,null,2)}</Text>
                    <Text fontSize="4xl">Login Succeed🎉</Text>
                    <Button
                        colorScheme="teal"
                        size="lg"
                        onClick={() => auth.signOut()}
                    >
                        Log out
                    </Button>
            </VStack>

            { profile_state === "INIT" ?
                <div>
                    "init"
                </div>
            :
            ""
            }
        </PrivateRoute>
    );
}