const express = require('express');
const {
    createPost,
    findPost,
    updatePost,
    findPostOfUser,
    postComment,
    deleteComment,
    updateLikeOnComment,
    findAllPosts
} = require('../controllers/postController');
const {cache} = require('../utils/cacheData')
const router = express.Router();

router.route('/').post(createPost);
router.route('/').get(findAllPosts);
router.route('/:postId').patch(updatePost);
router.route('/:postId').get( findPost);
router.route('/:userId/posts').get(findPostOfUser);
router.route('/comment/:postId').patch(postComment);
router.route('/comment/:postId/:commentId').patch(deleteComment);
router.route('/comment/:postId/:commentId/:flag').patch(updateLikeOnComment);



module.exports = router;