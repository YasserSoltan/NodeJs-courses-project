const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail , "Please enter a valid email address."],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [userRoles.USER, userRoles.ADMIN, userRoles.MODERATOR],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default: "../uploads/Profile.jpeg"
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
