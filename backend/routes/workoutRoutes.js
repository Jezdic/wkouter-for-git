const express = require('express');
const authController = require('./../controllers/authController');
const workoutController = require('./../controllers/workoutController');

const upload = require('../utils/multer');

const router = express.Router();

router.use(authController.protect);

router.route('/likeWorkout/:workoutId').post(workoutController.likeWorkout);

router
  .route('/comments/:workoutId')
  .post(workoutController.addComment)
  .delete(workoutController.deleteComment);

router.route('/user/:username').get(workoutController.getWorkoutsByUser);

router.route('/getFeed').get(workoutController.getFeed);

router
  .route('/')
  .post(upload.single('photo'), workoutController.createWorkout)
  .get(workoutController.getUserWorkouts);

router
  .route('/:workoutId')
  .get(workoutController.getOneWorkout)
  .patch(workoutController.updateWorkout)
  .delete(workoutController.deleteWorkout);

module.exports = router;
