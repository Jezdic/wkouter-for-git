const express = require('express');

const authController = require('./../controllers/authController');

const notificationController = require('./../controllers/notificationController');

const router = express.Router();

router.use(authController.protect);

router.route('/:notificationId').patch(notificationController.markAsRead);

router.route('/').get(notificationController.getNotifications);

module.exports = router;
