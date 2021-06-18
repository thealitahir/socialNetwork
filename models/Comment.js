const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'Post data is required'],
  }
  
},{ timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
