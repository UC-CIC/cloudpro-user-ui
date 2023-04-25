export interface Notification {
  date: string;
  notificationStatus: string;
  notification: string;
  notificationType: string;
}

export interface Notifications {
  [id: string]: Notification;
}

export interface UserNotifications {
  sub: string;
  notifications: Notification;
}
