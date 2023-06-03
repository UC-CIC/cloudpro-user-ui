import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
  CloseButton,
  ModalHeader,
  ModalCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
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
  if (!notifications?.notifications) {
    return <></>;
  } else {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Notifications</ModalHeader>
        <ModalCloseButton />
        <Container maxW="5xl">
          {Object.entries(notifications.notifications).map(
            ([key, notification]: [string, Notification]) => (
              <Alert
                key={key}
                status="info"
                variant="subtle"
                
                alignItems="left"
                justifyContent="left"
                textAlign="left"
                mb={4}
                mt={4}
              >
                <AlertIcon/>
                {notification.notificationType}: {notification.notification}
              </Alert>
            ),
          )}
          </Container>
        </ModalContent>
      </Modal>
    );
  }
};
