const express = require('express');
const {
    createLike,
    findPostLikes,
    findCommentsLikes,
    deleteLike
} = require('../controllers/likeController');
const router = express.Router();

router.route('/').post(createLike);
router.route('/:commentId/comments').get(findCommentsLikes);
router.route('/:postId/posts').get(findPostLikes);
router.route('/:likeId').delete(deleteLike);

module.exports = router;