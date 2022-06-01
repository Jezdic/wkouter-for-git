const Notification = require('../models/notificationModel');

const createAndSendNotification = async (type, data) => {
  const { notifierUsername } = data;

  let notificationMessage = `${notifierUsername}`;

  switch (type) {
    case 'likeWorkout':
      notificationMessage += ' liked your workout.';
      break;
    case 'likeComment':
      notificationMessage += ' liked your comment.';
      break;
    case 'comment':
      notificationMessage += ' commented on your workout.';
      break;
    case 'reply':
      notificationMessage += ' replied to your comment.';
      break;
    case 'follow':
      notificationMessage += ' started following you.';
      break;
    default:
      break;
  }

  const notification = await Notification.create({
    ...data,
    notificationMessage
  });

  notifyUser(notification);
};

module.exports = createAndSendNotification;
