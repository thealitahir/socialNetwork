const express = require('express');

const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');


const router = express.Router();

router.use('/user', userRoutes);
router.use('/post', postRoutes);


module.exports = router;