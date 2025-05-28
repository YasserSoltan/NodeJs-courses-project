const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courses.controller");
const { validationSchema } = require("../middlewares/validationSchema");
const verifyToken = require("../middlewares/verifyToken");
const allowedTo = require("../middlewares/allowedTo");
const userRoles = require("../utils/userRoles");

// get all courses
router
  .route("/")
  .get(courseController.getAllCourses)
  .post(verifyToken, validationSchema(), courseController.addCourse);

router
  .route("/:courseId")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MODERATOR), courseController.deleteCourse);

module.exports = router;
