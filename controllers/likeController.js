const Like = require('../models/Like');
//let {setData, getData} = require('../utils/cacheData');

exports.createLike = async (req, res) => {
    
  try {
      
      const { postLike, commentLike } = req.body;

      let newLike = new Like({
          postLike,
          commentLike
      });
      
      await newLike.save();

      return res.status(201).json({
        status: 'Success',
        data: newLike,
      });
    
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.findPostLikes = async (req, res) => {
  try {
      let id = req.params.postId;
      let key = id + 'postLike'

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
      // let dataFound = await getData(key);
      // if(dataFound) {
      //   return res.status(200).json({
      //     status: 'From redis',
      //     data: dataFound,
      //   });
      // }
      let likes = await Like.find({postLike:id}).populate({
          path : 'postLike',
          populate : {
            path : 'user'
          }
      });
      if (!likes) {
        return res.status(400).json({
            status: 'Fail',
            message: 'No Like found',
        });
      }

      let totalLikes = likes.length;
      //setData(key, likes)
      return res.status(200).json({
          status: 'Success',
          data: likes,
          count: totalLikes 
      });
  } catch (err) {
    return res.status(400).json({
        status: 'Fail',
        message: err,
    });
  }
};

exports.findCommentsLikes = async (req, res) => {
  try {
      let id = req.params.commentId;
      let key = id + 'commentLike'

      let errors = [];

      if (!id) {
          errors.push("Comment ID");
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
      let likes = await Like.find({commentLike:id}).populate({
          path : 'commentLike',
          populate : {
            path : 'post'
          }
      });;
      if (!likes) {
        return res.status(400).json({
            status: 'Fail',
            message: 'No Like found',
        });
      }
      
      let totalLikes = likes.length;
      //setData(key, likes)
      return res.status(200).json({
          status: 'Success',
          data: likes,
          count: totalLikes
      });
  } catch (err) {
    return res.status(400).json({
        status: 'Fail',
        message: err,
    });
  }
};

exports.deleteLike = async (req, res) => {
  try {
    let id = req.params.likeId;

    let errors = [];

    if (!id) {
        errors.push("Like ID");
    }
    
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
      message: `These are required fields: ${errors}.`,
      status: false,
      });
    }
    
    let deletedLike = await Like.findByIdAndRemove(id);
    
    if (!deletedLike) {
      return res.status(400).json({
        status: 'Fail',
        message: 'No Like found',
      });
    }

    return res.status(200).json({
      status: 'Success',
      data: deletedLike
    });
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};
