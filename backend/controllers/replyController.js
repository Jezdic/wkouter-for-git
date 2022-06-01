const Comment = require('./../models/commentModel');
const Reply = require('./../models/replyModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');
const Workout = require('../models/workoutModel');

const createAndSendNotification = require('../utils/notificationFactory');

exports.getReplies = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  const docQuery = { commentId };

  const features = new ApiFeatures(Reply.find(docQuery), req.query).sort();

  const replies = await features.query.populate({
    path: 'user',
    select: 'username photo'
  });

  res.status(200).json({
    status: 'success',
    replies
  });
});

exports.postReply = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  await Reply.create({
    ...req.body,
    user: req.user.id,
    commentId
  });

  const comment = await Comment.findById(commentId);

  const { workout } = comment;

  comment.numReplies = comment.numReplies + 1;

  await comment.save();

  const workoutObj = await Workout.findById(workout).populate({
    path: 'user',
    select: '_id username'
  });

  workoutObj.numReplies = workoutObj.numReplies + 1;

  await workoutObj.save();

  const { username: notifierUsername, photo: notifierImg } = req.user;

  const { photo: workoutImg } = workoutObj;

  const { _id: notifiedUserId, username: notifiedUsername } = workoutObj.user;

  const notificationData = {
    notifierUsername,
    notifierImg,
    workoutId: workout,
    workoutImg,
    notifiedUserId,
    notifiedUsername
  };

  createAndSendNotification('reply', notificationData);

  res.status(204).end();
});

exports.deleteMyComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (comment.user !== req.user.id)
    return next(new AppError('You can only delete your own comments', 401));

  await Comment.findByIdAndDelete(commentId);

  res.status(204).end();
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { commentId, workoutId } = req.params;

  const workout = await Workout.findById(workoutId);
  const comment = await Comment.findById(commentId);

  if (comment.workout !== workoutId || workout.user !== req.user.id)
    return next(
      new AppError('You are not authorized to perfom this action', 401)
    );

  await Comment.findByIdAndDelete(commentId);

  res.status(204).end();
});

exports.likeReply = catchAsync(async (req, res, next) => {
  const reply = await Reply.findById(req.params.replyId);
  console.log(reply);

  let likeStatus;

  if (reply.likes.includes(req.user.username)) {
    reply.likes = reply.likes.filter(like => like !== req.user.username);
    likeStatus = false;
  } else {
    reply.likes.push(req.user.username);
    likeStatus = true;

    const comment = await Comment.findById(reply.commentId);

    const workout = await Workout.findById(comment.workout).populate({
      path: 'user',
      select: '_id username'
    });

    const { username: notifierUsername, photo: notifierImg } = req.user;

    const { id: workoutId, photo: workoutImg } = workout;

    const { _id: notifiedUserId, username: notifiedUsername } = workout.user;

    const notificationData = {
      notifierUsername,
      notifierImg,
      workoutId,
      workoutImg,
      notifiedUserId,
      notifiedUsername
    };

    createAndSendNotification('likeComment', notificationData);
  }

  await reply.save();

  res.status(200).json({ likeStatus });
});

exports.editComment = catchAsync(async (req, res) => {});
