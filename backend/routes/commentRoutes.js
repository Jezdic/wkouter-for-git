const express = require('express');

const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');
const replyController = require('./../controllers/replyController');

const router = express.Router();

router.use(authController.protect);

router.route('/likeComment/:commentId').post(commentController.likeComment);

router.route('/likeReply/:replyId').post(replyController.likeReply);

router.route('/commentPreview').get(commentController.getCommentPreview);

router
  .route('/replies/:commentId')
  .post(replyController.postReply)
  .get(replyController.getReplies);

router
  .route('/myComment/:commentId')
  .patch(commentController.editComment)
  .delete(commentController.deleteMyComment);

router.route('/:workoutId/:commentId').delete(commentController.deleteComment);

router
  .route('/:workoutId')
  .get(commentController.getComments)
  .post(commentController.postComment);

module.exports = router;
