const Post = require('../models/Post');
let {setUserPostData, getUserPostData, setPostData, getPostData, deletePostData, deleteUserPostData} = require('../utils/cacheData');


exports.createPost = async (req, res) => {
    
  try {
    const { title, content, user } = req.body;

    let errors = [];

    if (!title) {
        errors.push("Title");
    }
    if (!content) {
      errors.push("Content");
    }
    if (!user) {
      errors.push("User Id");
    }
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }
    
  
    let newPost = new Post({
        title,
        content,
        user
    });
    
    await newPost.save();
    
    //setPostData('post', newPost.id, newPost);
    setUserPostData(newPost.user, newPost.id, newPost);
    
    return res.status(201).json({
      status: 'Success',
      data: newPost,
    });
    
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.findPost = async (req, res) => {
  try {
    let id = req.params.postId;

    let errors = [];

    if (!id) {
        errors.push("Post ID");
    }

    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
      message: `These are required fields: ${errors}.`,
      status: false,
      });
    }
    let dataFound = await getPostData(id);
    if(dataFound) {
      return res.status(200).json({
        status: 'From redis',
        data: dataFound,
      });
    }
    let post = await Post.findById(id).populate('user');
    if (!post) {
      return res.status(400).json({
          status: 'Fail',
          message: 'No Post found',
      });
    }
    
    return res.status(200).json({
      status: 'Success',
      data: post,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
}

exports.updatePost = async (req, res) => {
  try {
    let updates = req.body;

    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, updates, {new: true});
    if (!updatedPost) {
      return res.status(400).json({
        status: 'Fail',
        message: 'Post does not exist',
      });
    }
    deletePostData('post', updatedPost.id);
    setPostData('post', updatedPost.id, updatedPost);
    return res.status(200).json({
      status: 'Success',
      data: updatedPost,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.findPostOfUser = async (req, res) => {
  try {
    let id = req.params.userId;

    let errors = [];

    if (!id) {
      errors.push("User ID");
    }
    
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }

    let dataFound = await getUserPostData(id);
    var arrayOfObjects = Object.keys(dataFound)
    if(dataFound) {
      return res.status(200).json({
        status: 'From redis',
        data:arrayOfObjects,
      });
    }

    let post = await Post.find({user:id}).populate('user');
    if (!post) {
      return res.status(400).json({
        status: 'Fail',
        message: 'No Post found',
      });
    }
    return res.status(200).json({
      status: 'Success',
      data: post,
    });
  } catch (err) {
    return res.status(400).json({
        status: 'Fail',
        message: err,
    });
  }
};


exports.postComment = async (req, res) => {
  try {
    let postId = req.params.postId;
    let content = req.body.content;

    let comment = {
      content: content
    };
    
    let updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: comment } },
      { new: true }
    );
    deletePostData('post', updatedPost.id);
    setPostData('post', updatedPost.id, updatedPost);
      
    return res.status(200).json({
      status: 'Success',
      data: updatedPost,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    let postId = req.params.postId;
    let commentId = req.params.commentId;

    let updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    deletePostData('post', updatedPost.id);
    setPostData('post', updatedPost.id, updatedPost);
    return res.status(200).json({
      status: 'Success',
      data: updatedPost,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.updateLikeOnComment = async (req, res) => {
  try {
    let postId = req.params.postId;
    let commentId = req.params.commentId;
    let flag = req.params.flag;

    let updatedPost = await Post.update(
        { 
          _id: postId,
          'comments._id': commentId
        },
        { $set: {
          'comments.$.like':  flag
        } 
        },
        { new: true}
    )

    return res.status(200).json({
      status: 'Success',
      data: updatedPost,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.updateContentOfComment = async (req, res) => {
  try {

    let postId = req.params.postId;
    let commentId = req.params.commentId;
    let content = req.body.content;


    let updatedPost = await Post.findOneAndUpdate(
        { 
          _id: postId,
          'comments._id': commentId
        },
        { $set: {
          'comments.$.content':  content
          }
        },
        { new: true}
    );
    deletePostData('post', updatedPost.id);
    setPostData('post', updatedPost.id, updatedPost);
    return res.status(200).json({
      status: 'Success',
      data: updatedPost,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.findAllPosts = async (req, res) => {
  try {
    let key = 'AllPosts'
    
    let posts = await Post.find().populate('user');
    if (!posts) {
      return res.status(400).json({
          status: 'Fail',
          message: 'No Posts found',
      });
    }
    
    return res.status(200).json({
      status: 'Success',
      data: posts,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
}

exports.deletePost = async (req, res) => {
  try {
    const id = req.params.postId;

    const result = await Post.findByIdAndDelete(id);
    if (!result) {
      return res.status(400).json({
        status: 'Fail',
        message: 'Post does not exist',
      });
    }
    deletePostData('post', result.id)

    return res.status(200).json({
      status: 'Successful',
      message: 'Post delete successfully',
    });
  } catch (error) {
    return res.status(400).json({
      status: 'Fail',
      message: error,
    });
  }
};
