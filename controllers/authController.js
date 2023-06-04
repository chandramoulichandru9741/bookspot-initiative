const jwt = require('jsonwebtoken');
const util = require('util');
const CryptoJS = require('crypto-js');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
//sign jwt id
const JWT_EXPIRES_IN = '20h';
const sendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.cookie('jwt', token, {
    httpOnly: true,
  });
  // console.log(token);
  // Remove password from output
  user.password = undefined;
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
//Sign up
exports.signup = catchAsync(async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    passwordConfirm: req.body.passwordConfirm,
  });

  await newUser.save();
  sendToken(newUser, res);
});
//login
exports.login = catchAsync(async (req, res) => {
  //check user
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user)
    return res.status(404).json({
      status: 'fail',
      message: 'Account does not exist, please register for an account',
    });

  const compare = await user.comparePassword(user.password, password);
  if (!compare)
    return res.status(404).json({
      status: 'fail',
      message: 'Wrong account or password',
    });
  //check
  sendToken(user, res);
});
//logout
exports.logout = (req, res) => {
  //clearCookie
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

//isLoggined check user isLoggined to render UI ?
exports.isLoggined = async (req, res, next) => {
  // base on jwt save in cookie to detect user isLoggined
  if (req.cookies.jwt) {
    try {
      const decoded = await util.promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_KEY);
      const user = await User.findOne({ _id: decoded.id });
      if (!user) {
        throw new Error(' Account does not exist, please register for an account');
      }
      res.locals = user;
      req.user = user;

      return next();
    } catch (e) {
      return next();
    }
  }
  next();
};
//authorization
exports.authorization = (role) => {
  // authorize based on user role
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(401).json({ message: 'You are not allowed to do this' });
    }

    next();
  };
};
//update Password
exports.updatePasswordMe = catchAsync(async (req, res, next) => {
  const { password, newpassword, passwordConfirm } = req.body;
  
  const user = await User.findById(req.user._id).select('+password');
  const compare = await user.comparePassword(user.password, password);
  if (!compare) {
    throw new Error('Current password is wrong');
  }
  if (password === newpassword) {
    throw new Error('The new password is the same as the current password');
  }
  if (newpassword !== passwordConfirm) {
    throw new Error('Please confirm the correct password you changed');
  }
  user.password = passwordConfirm;
  await user.save();
  res.status(200).json({
    status: 'success',
    data: user,
  });
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Account does not exist, please register for an account');
  }
  const passwordRandom = Math.random().toString(36).substring(2, 8);
  console.log(passwordRandom);
  await sendEmail({
    email: user.email,
    subject: 'Change the password',
    message: `This is your new password:  ${passwordRandom}.      You can Login using this password and You can Update your password in your Profile.`,
  });
  user.password = passwordRandom;
  await user.save({ validateBeforeSave: false });
  return res.redirect('/');
});
