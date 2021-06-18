const Comment = require('../models/Comment');
//let {setData, getData} = require('../utils/cacheData');

exports.createComment = async (req, res) => {
    
    try {
        const { content, post } = req.body;

        let errors = [];

        if (!content) {
            errors.push("Content");
        }
        if (!post) {
            errors.push("Post Id");
        }
        if (errors.length > 0) {
            errors = errors.join(",");
            return res.json({
            message: `These are required fields: ${errors}.`,
            status: false,
            });
        }
      
        let newComment = new Comment({
            content,
            post
        });
        
        await newComment.save();

        return res.status(201).json({
          status: 'Success',
          data: newComment,
        });
      
    } catch (err) {
        return res.status(400).json({
        status: 'Fail',
        message: err,
      });
    }
};

exports.findComment = async (req, res) => {
    try {
        let id = req.params.commentId;

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
        // let dataFound = await getData(id);
        // if(dataFound!=null) {
        //   return res.status(200).json({
        //     status: 'From redis',
        //     data: dataFound,
        //   });
        // }

        let comment = await Comment.findById(id).populate({
            path : 'post',
            populate : {
              path : 'user'
            }
        });
        if (!comment) {
            return res.status(400).json({
                status: 'Fail',
                message: 'No Comment found',
            });
        }
        //setData(id, comment)
        return res.status(200).json({
            status: 'Success',
            data: comment,
        });
    } catch (err) {
        return res.status(400).json({
            status: 'Fail',
            message: err,
        });
    }
};

exports.updateComment = async (req, res) => {
    try {
      let updates = req.body;
  
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return res.status(400).json({
          status: 'Fail',
          message: 'Comment does not exist',
        });
      }
  
      const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, updates, {new: true});
      return res.status(200).json({
        status: 'Success',
        data: updatedComment,
      });
    } catch (err) {
        return res.status(400).json({
        status: 'Fail',
        message: err,
      });
    }
};

exports.findCommentOfPost = async (req, res) => {
    try {
        let id = req.params.postId;
        let key = id + 'commentOfPost'
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
        // if(dataFound!=null) {
        //   return res.status(200).json({
        //     status: 'From redis',
        //     data: dataFound,
        //   });
        // }
        let comment = await Comment.find({post:id}).populate({
            path : 'post',
            populate : {
              path : 'user'
            }
        });
        if (!comment) {
            return res.status(400).json({
                status: 'Fail',
                message: 'No Post found',
            });
        }
        //setData(key, comment)
        return res.status(200).json({
            status: 'Success',
            data: comment,
        });
    } catch (err) {
        return res.status(400).json({
            status: 'Fail',
            message: err,
        });
    }
}
