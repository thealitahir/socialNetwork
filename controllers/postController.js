const Post = require('../models/Post');
//let {setData, getData} = require('../utils/cacheData');


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
        // let dataFound = await getData(id);
        // if(dataFound) {
        //   return res.status(200).json({
        //     status: 'From redis',
        //     data: dataFound,
        //   });
        // }
        let post = await Post.findById(id).populate('user');
        if (!post) {
          return res.status(400).json({
              status: 'Fail',
              message: 'No Post found',
          });
        }
        //setData(post.id, post)
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
  
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(400).json({
          status: 'Fail',
          message: 'Post does not exist',
        });
      }
  
      const updatedPost = await Post.findByIdAndUpdate(req.params.postId, updates, {new: true});
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
        let key = id + 'postOfSpecficUser';

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

        // let dataFound = await getData(key);
        // if(dataFound) {
        //   return res.status(200).json({
        //     status: 'From redis',
        //     data: dataFound,
        //   });
        // }

        let post = await Post.find({user:id}).populate('user');
        if (!post) {
          return res.status(400).json({
            status: 'Fail',
            message: 'No Post found',
          });
        }
        //setData(key, post)
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
