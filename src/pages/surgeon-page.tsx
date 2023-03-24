import { Text, VStack, Link,Box } from "@chakra-ui/react";

import React, { useEffect,useState } from "react";

import { useAuth } from "../hooks/useAuth";

export const Surgeon: React.FC = () => {
    const auth = useAuth();

    const [isEmployee, setIsEmployee] = useState<string>("");

    useEffect(() => {
        const data = auth.currentUserInfo();
        data.then(svalue => {
            console.log(svalue)
            console.log(svalue.attributes["custom:isEmployee"]);
            setIsEmployee(svalue.attributes["custom:isEmployee"] as string)
        });
        
    }, [auth]);

    if (auth.isLoading) {
        return <Box />;
    }
    return (
            <VStack h={500} justify="center" spacing={8}>
                <Text fontSize="5xl">Welcome</Text>
                 { isEmployee === "1" ?
                    <Text fontSize="4xl">I am Surgeon 👩‍⚕️</Text>
                : <Text fontSize="4xl">I am Patient 😷 </Text>
                }
            </VStack>

    );
}