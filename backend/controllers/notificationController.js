const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');

const Notification = require('../models/notificationModel');

exports.getNotifications = catchAsync(async (req, res, next) => {
  const docQuery = { notifiedUserId: req.user.id };

  const features = new ApiFeatures(Notification.find(docQuery), req.query)
    .paginate()
    .sort();

  const notifications = await features.query;

  const total = await Notification.countDocuments(docQuery);

  const newNotifsQuery = { notifiedUserId: req.user.id, readStatus: false };

  const totalNewNotifs = await Notification.countDocuments(newNotifsQuery);

  res.status(200).json({
    status: 'success',
    total,
    totalNewNotifs,
    notifications
  });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  //find notification by id and update read status to true
  const { notificationId } = req.params;

  await Notification.findByIdAndUpdate(notificationId, { readStatus: true });
});
