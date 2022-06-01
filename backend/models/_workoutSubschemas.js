const mongoose = require('mongoose');

exports.exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise must have a name']
    },
    sets: {
      type: Number,
      required: [true, 'Exercise must contain number of sets']
    },
    reps: {
      type: Number,
      required: [true, 'Exercise must contain numbers of reps']
    },
    weight: String,
    id: String
  },
  { _id: false }
);
