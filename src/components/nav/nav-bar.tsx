import { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Spacer,
  IconButton,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

import Logo from '../Logo';

export const NavBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [display, changeDisplay] = useState('none');
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      px={4}
      position="fixed"
      w="100%"
      zIndex={20}
    >
      <Flex
        h={16}
        alignItems={'center'}
        justifyContent={'space-between'}
        display={['flex', 'flex', 'none', 'none']}
      >
        <Flex alignItems={'center'}>
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mr={2}
            icon={<HamburgerIcon />}
            onClick={() => changeDisplay('flex')}
            display={['flex', 'flex', 'none', 'none']}
          />
        </Flex>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </Flex>
      </Flex>

      <Flex
        w="100vw"
        display={display}
        bgColor={useColorModeValue('#fff', '#1A202C')}
        zIndex={20}
        h="100vh"
        pos="fixed"
        top="0"
        left="0"
        pr="4"
        overflowY="auto"
        flexDir="column"
      >
        <Flex justify="flex-end">
          <IconButton
            mt={2}
            mr={2}
            aria-label="Open Menu"
            size="lg"
            icon={<CloseIcon />}
            onClick={() => changeDisplay('none')}
          />
        </Flex>
        <Flex flexDir="column" align="center">
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            aria-label="Home"
            my={5}
            w="100%"
          >
            Home
          </Button>
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            aria-label="About"
            my={5}
            w="100%"
          >
            About
          </Button>
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            aria-label="Contact"
            my={5}
            w="100%"
          >
            Contact
          </Button>
        </Flex>
      </Flex>

      <Flex
        h={16}
        alignItems={'center'}
        justifyContent={'space-between'}
        display={['none', 'none', 'flex', 'flex']}
      >
        <Flex alignItems={'center'}>
          <Box p="4">
            <Logo />
          </Box>
          <Spacer />
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            aria-label="Home"
            my={5}
            w="100%"
          >
            Home
          </Button>
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            aria-label="About"
            my={5}
            w="100%"
          >
            About
          </Button>
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            aria-label="Contact"
            my={5}
            w="100%"
          >
            Contact
          </Button>
        </Flex>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};
