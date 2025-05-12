import React from 'react';
import { NavBar } from './nav/nav-bar';
import { NavBarAuthed } from './nav/nav-bar-authed';
import { Footer } from './nav/footer';

import { useAuth } from '../hooks/useAuth';

import { Grid, GridItem } from '@chakra-ui/react';

interface Props {
  children: JSX.Element;
}

export const PageLayout: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Grid
      templateAreas={'"nav nav" "main main" "footer footer"'}
      gridTemplateRows={{ base: '64px 1fr 150px', md: '64px 1fr 64px' }}
      gridTemplateColumns="150px 1fr"
      minHeight="100vh"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem pl="2" area="nav">
        {isAuthenticated ? <NavBarAuthed /> : <NavBar />}
      </GridItem>
      <GridItem pl="2" pt="6" pb="8" area="main">
        <div className="page-layout__content">{children}</div>
      </GridItem>
      <GridItem pl="2" area="footer">
        <Footer />
      </GridItem>
    </Grid>
  );
};
