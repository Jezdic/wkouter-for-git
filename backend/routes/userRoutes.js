const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const { uploadPhoto, resizeUserPhoto } = require('../utils/photoUpload');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  uploadPhoto,
  resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);
router.get('/getUserDetails/:username', userController.getUserDetails);
router.post('/followUser/:username', userController.followUser);
router.post('/unfollowUser/:username', userController.unfollowUser);

module.exports = router;
