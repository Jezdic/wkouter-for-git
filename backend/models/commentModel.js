const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user']
    },
    workout: {
      type: mongoose.Schema.ObjectId,
      ref: 'Workout',
      required: [true, 'Comment must belong to a workout']
    },
    comment: {
      type: String,
      required: [true, 'Comment cannot be empty']
    },
    likes: {
      type: [String]
    },
    numReplies: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

commentSchema.index({ workout: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
