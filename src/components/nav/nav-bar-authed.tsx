import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, NavLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Spacer,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
} from '@chakra-ui/icons';

import Logo from '../Logo';
import { useAuth } from '../../hooks/useAuth';
import { UserNotifications } from '../../models/notifications';
import { Notifications } from '../notifications/notification';
import { getNotificationsBySub } from '../../services/message.service';

export const NavBarAuthed = () => {
  const auth = useAuth();

  const { colorMode, toggleColorMode } = useColorMode();
  const [display, changeDisplay] = useState('none');
  const [notificationDisplay, setNotificationDisplay] = useState(false);

  const { data: notifications } = useQuery<UserNotifications>(
    ['notifications', auth.sub],
    async () => {
      const authToken = await auth.getAccessToken();
      const { data, error } = await getNotificationsBySub(auth.sub, authToken);
      if (!data) throw error;
      return data;
    },
  );

  const handleNotificationClick = () => {
    setNotificationDisplay(true);
  };

  const handleNotificationClose = () => {
    setNotificationDisplay(false);
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      px="4"
      position="fixed"
      w="100%"
      zIndex="20"
    >
      <Flex
        h="16"
        alignItems="center"
        justifyContent="space-between"
        display={['flex', 'flex', 'none', 'none']}
      >
        <Flex alignItems="center">
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mr="2"
            icon={<HamburgerIcon />}
            onClick={() => changeDisplay('flex')}
            display={['flex', 'flex', 'none', 'none']}
          />
        </Flex>

        <Flex alignItems="center">
          <Stack direction="row" spacing="7">
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Button>
              <BellIcon />
            </Button>
          </Stack>
        </Flex>
      </Flex>

      <Flex
        w="100vw"
        display={display}
        bgColor={useColorModeValue('#fff', '#1A202C')}
        zIndex="20"
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
            mt="2"
            mr="2"
            aria-label="Open Menu"
            size="lg"
            icon={<CloseIcon />}
            onClick={() => changeDisplay('none')}
          />
        </Flex>
        <Flex flexDir="column" align="center">
          <Avatar
            size="sm"
            src="https://avatars.dicebear.com/api/male/username.svg"
          />
          <Box p="4">Username</Box>
          <Spacer pb="4" />
          <Divider />

          <Button
            as={NavLink}
            to="/"
            variant="ghost"
            aria-label="Home"
            my="5"
            w="100%"
          >
            Surveys
          </Button>
          <Button
            as={NavLink}
            to="/"
            variant="ghost"
            aria-label="Home"
            my="5"
            w="100%"
          >
            Account Settings
          </Button>
          <Button
            as={NavLink}
            to="/"
            variant="ghost"
            aria-label="Home"
            my="5"
            w="100%"
            onClick={() => auth.signOut()}
          >
            Logout
          </Button>
        </Flex>
      </Flex>

      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        display={['none', 'none', 'flex', 'flex']}
      >
        <Flex alignItems="center">
          <Box p="4">
            <Link to="/">
              <Logo />
            </Link>
          </Box>
        </Flex>

        <Flex alignItems="center">
          <Stack direction="row" spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Button onClick={handleNotificationClick}>
              <BellIcon />
              <Notifications
                notifications={notifications}
                isOpen={notificationDisplay}
                onClose={handleNotificationClose}
              />
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW="0"
              >
                <Avatar
                  size="sm"
                  src="https://avatars.dicebear.com/api/male/username.svg"
                />
              </MenuButton>
              <MenuList alignItems="center">
                <br />
                <Center>
                  <Avatar
                    size="2xl"
                    src="https://avatars.dicebear.com/api/male/username.svg"
                  />
                </Center>
                <br />
                <Center>
                  <p>Username</p>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem>Surveys</MenuItem>
                <MenuItem>Account Settings</MenuItem>
                <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};
