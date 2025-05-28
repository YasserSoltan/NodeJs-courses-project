const express = require("express");
const userController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const multer = require("multer");
const appError = require("../utils/appError");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imgType = file.mimetype.split("/")[0];
  if (imgType !== "image") {
    return cb(appError.create("Invalid file type", 400), false);
  } else if (imgType === "image") {
    cb(null, true);
  }
};
const upload = multer({ storage: diskStorage, fileFilter });

// get all users
router.route("/").get(verifyToken, userController.getAllUsers);

// register
router
  .route("/register")
  .post(upload.single("avatar"), userController.registerUser);

// login
router.route("/login").post(userController.loginUser);

module.exports = router;
