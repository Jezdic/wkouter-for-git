const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user']
    },
    commentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
      required: [true, 'Reply must belong to a comment']
    },
    comment: {
      type: String,
      required: [true, 'Comment cannot be empty']
    },
    likes: {
      type: [String]
    }
  },
  { timestamps: true }
);

replySchema.index({ commentId: 1 });

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
