import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
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
          {Object.entries(notifications.notifications).map(
            ([key, notification]: [string, Notification]) => (
              <Alert
                key={key}
                status="info"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                width="100%"
                height="200px"
                m={4}
              >
                <AlertIcon boxSize="40px" m={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  {notification.notificationType}
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                  {notification.notification}
                </AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={onClose}
                />
              </Alert>
            ),
          )}
        </ModalContent>
      </Modal>
    );
  }
};
