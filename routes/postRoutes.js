const express = require('express');
const {
    createPost,
    findPost,
    updatePost,
    findPostOfUser,
    postComment,
    deleteComment,
    updateLikeOnComment,
    findAllPosts,
    updateContentOfComment,
    deletePost
} = require('../controllers/postController');
const router = express.Router();

router.route('/').post(createPost);
router.route('/').get(findAllPosts);
router.route('/:postId').patch(updatePost);
router.route('/:postId').delete(deletePost);
router.route('/:postId').get( findPost);
router.route('/:userId/posts').get(findPostOfUser);
router.route('/comment/:postId').patch(postComment);
router.route('/comment/:postId/:commentId').patch(deleteComment);
router.route('/comment/edit/:postId/:commentId').patch(updateContentOfComment);
router.route('/comment/:postId/:commentId/:flag').patch(updateLikeOnComment);




module.exports = router;