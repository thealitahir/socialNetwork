const express = require('express');
const {
    createComment,
    findComment,
    findCommentOfPost,
    updateComment
} = require('../controllers/commentController');
const router = express.Router();

router.route('/').post(createComment);
router.route('/:commentId').patch(updateComment);
router.route('/:commentId').get(findComment);
router.route('/:postId/comments').get(findCommentOfPost);


module.exports = router;