const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User data is required'],
  },
  like:{
    type: Boolean,
    default: false
  },
  comments:[
    {
      content: {
        type: String
      },
      like:{
        type: Boolean,
        default: false
      },
    }
  ]
  
},{ timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
