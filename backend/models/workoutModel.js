const mongoose = require('mongoose');
const { exerciseSchema } = require('./_workoutSubschemas');

const arrayValidator = {
  validator: v => Array.isArray(v) && v.length > 0,
  message: 'Exercises cannot be empty'
};

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Workout must have a title']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Workout must belong to a user']
    },
    exercisesPlanned: {
      type: [exerciseSchema],
      required: [true, 'Workout must have planned exercises'],
      validate: arrayValidator
    },
    notes: String,
    plannedDate: {
      type: Date,
      required: [true, 'Please iclude workout date']
    },
    likes: {
      type: [String]
    },
    numComments: {
      type: Number,
      default: 0
    },
    numReplies: {
      type: Number,
      default: 0
    },
    photo: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

workoutSchema.index({ user: 1 });

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
