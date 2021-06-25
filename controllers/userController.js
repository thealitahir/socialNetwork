const bcrypt = require("bcryptjs");

const User = require('../models/User');

exports.signup = async (req, res) => {
    
  try {

    const { firstName, lastName, email, password, userName } = req.body;
    let errors = [];

    if (!firstName) {
      errors.push("First name");
    }
    if (!lastName) {
        errors.push("Last name");
    }
    if (!userName) {
        errors.push("User name");
    }
    if (!email) {
      errors.push("Email");
    }
    if (!password) {
      errors.push("Password");
    }
    if (errors.length > 0) {
      errors = errors.join(",");
      return res.json({
        message: `These are required fields: ${errors}.`,
        status: false,
      });
    }

    const alreadyExistEmail = await User.findOne({ email: req.body.email });
    if (alreadyExistEmail) {
      return res.status(404).json({
        status: 'Fail',
        message: 'User already exists!'
      });
    } else {
      let newUser = new User({
          firstName,
          lastName,
          email,
          userName,
          password
      });
      
      let salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();

      return res.status(201).json({
        status: 'Success',
        data: newUser,
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: 'Fail',
      message: err,
    });
  }
};

exports.findUser = async (req, res) => {
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
  
    let user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
          status: 'Fail',
          message: 'No User found',
      });
    }
    
    return res.status(200).json({
        status: 'Success',
        data: user,
    });
  } catch (err) {
    return res.status(400).json({
        status: 'Fail',
        message: err,
    });
  }
};

exports.updateUser = async (req, res) => {
    try {
      let updates = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(req.params.userId, updates, {new: true});

      if (!updatedUser) {
        return res.status(400).json({
          status: 'Fail',
          message: 'User does not exist',
        });
      }
      return res.status(200).json({
        status: 'Success',
        data: updatedUser,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'Fail',
        message: err,
      });
    }
};
  