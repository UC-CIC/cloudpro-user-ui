import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton,Modal,ModalOverlay,ModalContent } from "@chakra-ui/react"

interface NotificationsProps {
    isOpen: boolean;
    notifications:any;
    onClose: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ isOpen, notifications,onClose}) => {
    return ( 
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
        <ModalContent>


            { Object.entries(notifications.notifications).map(( [key,notification]) => (
                <Alert 
                status="info" 
                variant="subtle" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                textAlign="center" 
                width="100%"
                height="200px" m={4}>
                    <AlertIcon boxSize="40px" m={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        {(notification as any).notification_type}
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        {(notification as any).notification}
                    </AlertDescription>
                    <CloseButton position="absolute" right="8px" top="8px" onClick={onClose}/>
                </Alert>
                ))
            }
            </ModalContent>
        </Modal>
    );
}
