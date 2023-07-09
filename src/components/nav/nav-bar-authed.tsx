import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, NavLink } from 'react-router-dom';
import {
  BellIcon,
  CloseIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';

import Logo from '../Logo';
import { useAuth } from '../../hooks/useAuth';
import { UserNotifications } from '../../models/notifications';
import { Notifications } from '../notifications/notification';
import { getNotificationsBySub } from '../../services/message.service';

// Settings to limit display to mobile screens
const MOBILE_DISPLAY = ['flex', 'flex', 'none', 'none'];

// Settings to limit display to desktop screens
const DESKTOP_DISPLAY = ['none', 'none', 'flex', 'flex'];

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

  const menuItems: any = [
    {
      'aria-label': 'Surveys',
      as: NavLink,
      to: '/home',
      children: 'Surveys',
    },
    {
      'aria-label': 'Reports',
      as: NavLink,
      to: '/pt-authed-reporting',
      children: 'Reports',
    },
    {
      'aria-label': 'Account Settings',
      as: NavLink,
      to: '/',
      children: 'Account Settings',
    },
    {
      'aria-label': 'Logout',
      as: NavLink,
      children: 'Logout',
      to: '/',
      onClick: () => auth.signOut(),
    },
  ];

  return (
    <Flex
      position="fixed"
      left="0"
      right="0"
      zIndex="20"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      h={16}
      bg={useColorModeValue('white', 'gray.900')}
    >
      {/* Left side of navbar */}
      <Flex alignItems="center" pl="4">
        {/* Menu button (mobile) */}
        <IconButton
          aria-label="Open Menu"
          size="lg"
          mr="2"
          icon={<HamburgerIcon />}
          onClick={() => changeDisplay('flex')}
          display={MOBILE_DISPLAY}
        />

        {/* Logo (desktop) */}
        <Box display={DESKTOP_DISPLAY} p="4">
          <Link to="/">
            <Logo />
          </Link>
        </Box>
      </Flex>

      {/* Right side of navbar */}
      <Flex alignItems="center" pr="4">
        <Stack direction="row" spacing={7}>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Button onClick={() => setNotificationDisplay(true)}>
            <BellIcon />
            <Notifications
              notifications={notifications}
              isOpen={notificationDisplay}
              onClose={() => setNotificationDisplay(false)}
            />
          </Button>

          {/* Menu (desktop) */}
          <Box display={DESKTOP_DISPLAY}>
            <Menu>
              {/* Menu toggle */}
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

              {/* Menu body */}
              <MenuList alignItems="center">
                <Center>
                  <Avatar
                    size="lg"
                    src="https://avatars.dicebear.com/api/male/username.svg"
                  />
                </Center>
                <Text py="2" textAlign="center">
                  Username
                </Text>
                <MenuDivider />
                {menuItems.map(({ children, ...props }: any) => (
                  <MenuItem {...props} key={children} fontWeight="normal">
                    {children}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Stack>

        {/* Menu (mobile) */}
        <Flex
          zIndex="20"
          pos="fixed"
          top="0"
          right="0"
          left="0"
          display={display}
          flexDir="column"
          w="100vw"
          h="100vh"
          overflowY="auto"
          bgColor={useColorModeValue('#fff', '#1A202C')}
        >
          {/* Menu close button */}
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
              size="lg"
              src="https://avatars.dicebear.com/api/male/username.svg"
            />
            <Text pt="4" pb="8" textAlign="center">
              Username
            </Text>
            <Divider />
            {menuItems.map(({ children, ...props }: any) => (
              <Button
                {...props}
                key={children}
                variant="ghost"
                py="4"
                w="100%"
                height="auto"
              >
                {children}
              </Button>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
