const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    notifiedUserId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Notified user Id must be provided']
    },
    notifiedUsername: {
      type: String,
      required: [true, 'Notified username must be provided']
    },
    workoutId: {
      type: mongoose.Schema.ObjectId
    },
    readStatus: {
      type: Boolean,
      default: false
    },
    workoutImg: String,
    notifierImg: String,
    notifierUsername: String,
    notificationMessage: String
  },
  { timestamps: true }
);

notificationSchema.index({ notifiedUserId: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
