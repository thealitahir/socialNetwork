const express = require('express');
const {
    createPost,
    findPost,
    updatePost,
    findPostOfUser

} = require('../controllers/postController');
const {cache} = require('../utils/cacheData')
const router = express.Router();

router.route('/').post(createPost);
router.route('/:postId').patch(updatePost);
router.route('/:postId').get( findPost);
router.route('/:userId/posts').get(findPostOfUser);


module.exports = router;