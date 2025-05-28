const { validationResult } = require("express-validator");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Course = require("../models/course.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: 0 }).skip(skip).limit(limit);
  res.send({
    status: httpStatusText.SUCCESS,
    result: courses.length,
    data: {
      courses,
    },
  });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create("Course not found", 404, httpStatusText.FAIL);
    return next(error);
  }
  return res.json({
    status: httpStatusText.SUCCESS,
    data: {
      course,
    },
  });
});

const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 404, httpStatusText.FAIL);
    return next(error);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: {
      course: newCourse,
    },
  });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;

  // // return original object before update
  // const updatedCourse = await Course.findByIdAndUpdate(courseId, {
  //   $set: { ...req.body },
  // });
  const updatedCourse = await Course.updateOne(
    { _id: courseId },
    { $set: { ...req.body } }
  );
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      course: updatedCourse,
    },
  });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  await Course.deleteOne({ _id: req.params.courseId });
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: null,
  });
});

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
