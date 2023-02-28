import React from "react";
import { NavBar } from "./nav/nav-bar";
import { NavBarAuthed } from "./nav/nav-bar-authed";
import { Footer } from "./nav/footer";

import { useAuth } from "../hooks/useAuth";

import { Grid, GridItem } from "@chakra-ui/react";

import PrivateRoute from "../components/PrivateRoute";

interface Props {
  children: JSX.Element;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
  const auth = useAuth();

  return (
    <Grid
      templateAreas={`"nav nav"
                  "main main"
                  "footer footer"`}
      gridTemplateRows={"50px 1fr 30px"}
      gridTemplateColumns={"150px 1fr"}
      h="200px"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem pl="2" area={"nav"}>
        {auth.isAuthenticated === false ? <NavBar /> : <PrivateRoute><NavBarAuthed /></PrivateRoute>}
      </GridItem>
      <GridItem pl="2" area={"main"}>
        <div className="page-layout__content">{children}</div>
      </GridItem>
      <GridItem pl="2" area={"footer"}>
        <Footer />
      </GridItem>
    </Grid>
  );
};
