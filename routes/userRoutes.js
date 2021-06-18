const express = require('express');
const {
    signup,
    findUser,
    updateUser
} = require('../controllers/userController');
const router = express.Router();

router.route('/').post(signup);
router.route('/:userId').patch(updateUser);
router.route('/:userId').get(findUser);

module.exports = router;