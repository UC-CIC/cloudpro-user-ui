import { useMemo } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import { Notification, UserNotifications } from '../../models/notifications';

interface NotificationsProps {
  isOpen: boolean;
  notifications?: UserNotifications | undefined;
  onClose: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({
  isOpen,
  notifications,
  onClose,
}) => {
  const notificationsList = useMemo(() => {
    return Object.entries<Notification>(notifications?.notifications || {})
      .map(([key, notification]: [string, Notification]) => {
        return { ...notification, date: new Date(notification.date), key };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [notifications]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Notifications</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Container maxW="5xl" pb="4">
            {notificationsList.length === 0 ? (
              <Center>You have no new notifications at this time.</Center>
            ) : (
              notificationsList.map((notification) => (
                <Alert
                  key={notification.key}
                  status={notification.notificationType.toLowerCase() as any}
                  variant="subtle"
                  alignItems="left"
                  justifyContent="left"
                  textAlign="left"
                  mb={4}
                  mt={4}
                >
                  <AlertIcon />
                  <AlertTitle>{notification.notificationType}:</AlertTitle>
                  <AlertDescription>
                    {notification.notification}
                  </AlertDescription>
                </Alert>
              ))
            )}
          </Container>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
