const Course = require("../../models/Course");
const User = require("../../models/User");
const Material = require("../../models/Materials");
const { getResponse } = require("../../util/commonReponseUtil");
const { SUCCESS_RESPONSE } = require("../../constants/response");
const mongoose = require("mongoose");
const Details = require("../../models/Details");


const updateCourse = (req, res) => {
  Course.findByIdAndUpdate(
    req.body.id,
    { isAccessible: req.body.isAccessible }, 
    (err) => getResponse(err, SUCCESS_RESPONSE, res)
  );
};

const editCourse = (req, res) => {
  Course.findByIdAndUpdate(
    req.body.courseId,
    { 
      name : req.body.course.title,
      description: req.body.course.details,
    }, 
    (err) => getResponse(err, SUCCESS_RESPONSE, res)
  );
};

const fetchCourses = (req, res) => {
  Course.find({}).populate("createdBy", 'name').then((courses) => getResponse(null, courses, res), (err) => getResponse(err, SUCCESS_RESPONSE, res));
};

const addCourse = (req, res) => {
  const data = JSON.parse(req.body.data);
  const newCourse = new Course({
    name: data.name,
    courseId: data.courseId,
    description: data.description,
    coverImage: req.file.filename,
    createdBy: req.user._id,
  });
  newCourse.save().then((course) => getResponse(null, SUCCESS_RESPONSE, res), (err) => getResponse(err, SUCCESS_RESPONSE, res));
};

const addMaterial = (req, res) => {
  const data = JSON.parse(req.body.data);
  const newCourse = new Material({
    name: data.name,
    courseId: data.courseId,
    fileName: req.file.filename,
  });
  newCourse.save().then((course) => getResponse(null, course, res), (err) => getResponse(err, SUCCESS_RESPONSE, res));
};

const fetchCourse = async (req, res) => {
  const pipeline = req.user.roles.includes("student")?[{"$match":{"tests.isAccessable":true}}]: [{"$match":{}}];
  const course = await Course.aggregate([
    {
      "$match": {
        _id: mongoose.Types.ObjectId(req.body.courseId),
      },
    },
    {
      "$lookup": {
        from: 'tests',
        'localField': '_id',
        'foreignField': 'courseId',
        'as': 'assignments'
      }
    },
    {
      "$lookup": {
        from: 'materials',
        'localField': '_id',
        'foreignField': 'courseId',
        'as': 'materials'
      }
    }
  ]).exec();
  
  const course2 = await Course.populate(course, {path:'createdBy', model: 'users', select:'name'});
  const result =[];
  for (const test of course2[0].assignments) {
    if(!req.user.roles.includes("student") || test.isAccessible)
    {
    const count = await Details.count({ testId: test._id, student: req.user._id });
    result.push({...test, attemptsLeft:count});
    }
  }
  getResponse(null, {...course2[0], assignments:result}, res);
};

module.exports = {
  updateCourse,
  fetchCourses,
  addCourse,
  fetchCourse,
  editCourse,
  addMaterial
};
