const Comment = require('./../models/commentModel');
const Reply = require('./../models/replyModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');
const Workout = require('../models/workoutModel');

const createAndSendNotification = require('../utils/notificationFactory');

exports.getComments = catchAsync(async (req, res) => {
  const { workoutId } = req.params;

  const docQuery = { workout: workoutId };

  const features = new ApiFeatures(Comment.find(docQuery), req.query)
    .paginate()
    .sort();

  const comments = await features.query.populate({
    path: 'user',
    select: 'username photo'
  });

  const total = await Comment.countDocuments(docQuery);

  res.status(200).json({
    status: 'success',
    total,
    comments
  });
});

exports.postComment = catchAsync(async (req, res) => {
  const { workoutId } = req.params;

  const { id: commentId } = await Comment.create({
    ...req.body,
    user: req.user.id,
    workout: workoutId
  });

  const workout = await Workout.findById(workoutId).populate({
    path: 'user',
    select: '_id username'
  });

  workout.numComments = workout.numComments + 1;

  await workout.save();

  const { username: notifierUsername, photo: notifierImg } = req.user;

  const { photo: workoutImg } = workout;

  const { _id: notifiedUserId, username: notifiedUsername } = workout.user;

  const notificationData = {
    notifierUsername,
    notifierImg,
    workoutId,
    workoutImg,
    notifiedUserId,
    notifiedUsername,
    commentId
  };

  createAndSendNotification('comment', notificationData);

  res.status(204).end();
});

exports.getCommentPreview = catchAsync(async (req, res, next) => {
  let preview;
  const { commentId, replyId } = req.body;
  if (commentId) preview = await Comment.findById(commentId);
  if (replyId) preview = await Reply.findById(replyId);

  if (!preview) return next(new AppError('Preview not found', 404));

  res.status(200).json({ status: 'success', preview: preview.comment });
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

exports.likeComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId).populate({
    path: 'user',
    select: '_id username'
  });

  let likeStatus;

  if (comment.likes.includes(req.user.username)) {
    comment.likes = comment.likes.filter(like => like !== req.user.username);
    likeStatus = false;
  } else {
    comment.likes.push(req.user.username);
    likeStatus = true;

    const workout = await Workout.findById(comment.workout).populate({
      path: 'user',
      select: '_id username'
    });

    const { username: notifierUsername, photo: notifierImg } = req.user;

    const { id: workoutId, photo: workoutImg } = workout;

    const { _id: notifiedUserId, username: notifiedUsername } = comment.user;

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

  await comment.save();

  res.status(200).json({ likeStatus });
});

exports.editComment = catchAsync(async (req, res) => {});
