const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const createAndSendNotification = require('./../utils/notificationFactory');

const { unlink } = require('fs');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'username', 'email', 'goals');

  if (req.file) {
    filteredBody.photo = req.file.filename;

    if (req.user.photo !== 'default.jpg')
      unlink(`./public/img/users/${req.user.photo}`, err => {
        if (err) console.error(err.message);
      });
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: false
  }).populate({
    path: 'following',
    select: '-__v -following -email'
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.followUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  if (req.user.username === username)
    return next(new AppError('You cannot follow yourself', 400));

  const followedUser = await User.findOne({ username }).select(
    '-__v -email -following '
  );
  if (!followedUser) return next(new AppError('User not found', 404));

  const user = await User.findById(req.user.id);

  if (user.following.includes(followedUser._id))
    return next(new AppError('User already followed', 400));

  await User.findByIdAndUpdate(req.user.id, {
    $push: { following: followedUser._id }
  });

  const { username: notifierUsername, photo: notifierImg } = req.user;

  const notificationData = {
    notifierUsername,
    notifierImg,
    notifiedUserId: followedUser._id,
    notifiedUsername: username
  };

  createAndSendNotification('follow', notificationData);

  res.status(200).json({
    status: 'success',
    data: {
      followedUser
    }
  });
});

exports.unfollowUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  const followedUser = await User.findOne({ username }).select(
    '-__v -email -following '
  );
  if (!followedUser) return next(new AppError('User not found', 404));

  await User.findByIdAndUpdate(req.user.id, {
    $pull: { following: followedUser._id }
  });

  res.status(200).json({
    status: 'success'
  });
});

exports.getUserResults = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  const users = await User.find({
    username: { $regex: `^${username}`, $options: 'i' }
  }).select('photo username');

  res.status(200).json({ status: 'success', users });
});

exports.getUserDetails = catchAsync(async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).select(
    'photo joinedSince goals username'
  );
  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    user
  });
});
