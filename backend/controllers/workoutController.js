const Workout = require('./../models/workoutModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');

const cloudinary = require('../utils/cloudinary');

const createAndSendNotification = require('../utils/notificationFactory');

exports.createWorkout = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const result = await cloudinary.uploader.upload(req.file.path);

  const workout = await Workout.create({
    ...req.body,
    exercisesPlanned: JSON.parse(req.body.exercisesPlanned),
    user: req.user.id,
    photo: result.url
  });

  res.status(201).json({
    status: 'success',
    data: {
      workout
    }
  });
});

exports.getUserWorkouts = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(
    Workout.find({ user: req.user.id }),
    req.query
  ).sort();
  const workouts = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      workouts
    }
  });
});

exports.getWorkoutsByUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return next(new AppError('User not found', 404));

  const id = user._id;

  const features = new ApiFeatures(
    Workout.find({ user: id }),
    req.query
  ).sort();

  const workouts = await features.query.populate({
    path: 'comments.user',
    select: 'username photo'
  });

  if (!workouts)
    return next(new AppError('No workouts found for that user', 404));

  res.status(200).json({
    status: 'success',
    data: {
      workouts
    }
  });
});

exports.getFeed = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const followingArr = user.following.map(el => mongoose.Types.ObjectId(el));

  const docQuery = { user: { $in: followingArr } };

  const features = new ApiFeatures(Workout.find(docQuery), req.query)
    .paginate()
    .sort();

  const workouts = await features.query
    .populate({
      path: 'user',
      select: 'username photo'
    })
    .populate({ path: 'comments.user', select: 'username photo' });

  const total = await Workout.countDocuments(docQuery);

  res.status(200).json({
    status: 'success',
    total,
    workouts
  });
});

exports.getOneWorkout = catchAsync(async (req, res, next) => {
  const workout = await Workout.findById(req.params.workoutId).populate({
    path: 'user',
    select: 'username photo'
  });

  if (!workout) return next(new AppError('No workout found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      workout
    }
  });
});

exports.updateWorkout = catchAsync(async (req, res, next) => {
  const workout = await Workout.findByIdAndUpdate(
    req.params.workoutId,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!workout) return next(new AppError('No workout found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      workout
    }
  });
});

exports.likeWorkout = catchAsync(async (req, res, next) => {
  const workout = await Workout.findById(req.params.workoutId).populate({
    path: 'user',
    select: 'username _id'
  });
  let likeStatus;

  if (workout.likes.includes(req.user.username)) {
    workout.likes = workout.likes.filter(like => like !== req.user.username);
    likeStatus = false;
  } else {
    workout.likes.push(req.user.username);
    likeStatus = true;

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

    createAndSendNotification('likeWorkout', notificationData);
  }

  await workout.save();

  res.status(200).json({ likeStatus });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { comment } = req.body;

  const workout = await Workout.findById(req.params.workoutId);

  workout.comments.push({ user: id, comment });

  await workout.save();

  res.status(201).end();
});

exports.deleteComment = catchAsync(async (req, res, next) => {});

exports.deleteWorkout = catchAsync(async (req, res, next) => {
  const workout = await Workout.findByIdAndDelete(req.params.workoutId);

  if (!workout) return next(new AppError('No workout found with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});
