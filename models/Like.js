const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  postLike: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
  commentLike: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  }  
},{ timestamps: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;