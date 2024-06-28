import axios from 'axios';

const GetNotifications = () => axios.get('/notify_hub/notifications/');

const NotificationsService = {
  GetNotifications,
};

export default NotificationsService;
