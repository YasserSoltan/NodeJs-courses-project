const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const User = require("../models/user.model");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: 0, password: 0 })
    .skip(skip)
    .limit(limit);
  res.send({
    status: httpStatusText.SUCCESS,
    result: users.length,
    data: {
      users,
    },
  });
});

const registerUser = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const existingUser = await User.find({ email: email });
  if (existingUser.length > 0) {
    const error = appError.create(
      "User with this email already exists.",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file ? req.file.filename : null,
  });

  const token = await generateJWT({ email: newUser.email, role: newUser.role }, "1m");
  if (!token) {
    const error = appError.create(
      "Failed to generate token.",
      500,
      httpStatusText.FAIL
    );
    return next(error);
  }
  newUser.token = token;
  await newUser.save();
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "User registered successfully.",
    data: {
      user: newUser,
    },
  });
});

const loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = appError.create(
      "email and password are required.",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create(
      "User with this email does not exist.",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (user && isPasswordValid) {
    const token = await generateJWT({ email: email, role: user.role }, "1m");
    return res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "User logged in successfully.",
      data: { token: token },
    });
  } else {
    const error = appError.create(
      "Invalid email or password.",
      401,
      httpStatusText.FAIL
    );
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
};
