import { Text, VStack, Link } from "@chakra-ui/react";

import {
    NavLink as RouterLink, // <-- import the NavLink component
  } from "react-router-dom";


export function Registered() {

    return (

            <VStack h={500} justify="center" spacing={8}>
                <Text fontSize="5xl">Welcome</Text>
                <Text fontSize="4xl">Registration Succeed🎉</Text>
                <Link as={RouterLink} to="/signin">Login</Link>
            </VStack>
    );
}