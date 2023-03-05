import { useAuth } from "../hooks/useAuth";
import PrivateRoute from "../components/PrivateRoute";
import React, { useEffect,useState } from "react";
import { getUserProfile } from "../services/message.service";
import { Box } from "@chakra-ui/react";

import { PageLayout } from "../components/page-layout";
import { ProfileSetup } from "../components/profile-setup";
import { PtDash } from "../components/pt-dash";
import { PtNav } from "../components/ptdash/pt-nav";

export const PtAuthedLanding: React.FC = () => {
    const auth = useAuth();


    const [profile_state, setProfileState] = useState<string>("");
    const [profile, setProfile] = useState({});

    const [hospital, setHopital] = useState("");
    const [surgeon, setSurgeon] = useState("");
    const [surgdate, setSurgdate] = useState("");

    const getMessageUserProfile = async (sub:string) => {
        let auth_token = await auth.getAccessToken();
        console.log(auth_token)
        const { data, error } = await getUserProfile(sub,auth_token);

        if (data) {
        }

        if (error) {
        }

        return data;
    };

    useEffect(() => {
        console.log("useEffect()");
        let isMounted = true;

        if (!isMounted || auth.sub==="") {
        return;
        }
        console.log("Trying with: ", auth.sub)
        const data=getMessageUserProfile(auth.sub);

        data.then(svalue => { 
            let key:string = "state"
            let state:string = ""

            console.log("Svalue: ",svalue);

            if( svalue != null ){
                state = svalue[key];
                console.log("state: ",svalue);
                setProfileState(state);
                setProfile(svalue);

                setHopital(svalue.profile.hospital);
                setSurgeon(svalue.profile.surgeon);
                setSurgdate(svalue.profile.surgery_date);
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
        <PageLayout>
            <PrivateRoute>
                
                    { profile_state === "INIT" ?
                        <ProfileSetup uid={auth.sub} email={auth.username} profile={profile}/>
                    :
                    ""
                    }
                    { profile_state === "STAGED" ?
                        <ProfileSetup uid={auth.sub} email={auth.username} profile={profile}/>
                    :
                    ""
                    }
                    { profile_state === "COMPLETE" ?
                    <>
                        
                        <PtNav hospital={hospital} surgeon={surgeon} surgdate={surgdate}/>
                    </>
                    : ""
                    }
                
            </PrivateRoute>
        </PageLayout>
    );
}
/*
<Button
colorScheme="teal"
size="lg"
onClick={() => auth.signOut()}
>
Log out
</Button>
*/