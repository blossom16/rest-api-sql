"use strict";

const express = require("express");
const Course = require("../models").Course;
const User = require("../models").User;
const { authenticateUser } = require('../middleware/auth-user');
const router = express.Router();

// Handler function to wrap each route
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}

// Returns a user list
router.get("/users", authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
}));

// Create a new user
router.post("/users", asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).location('/').json({ message: "Account created!" }).end();
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// List all courses and current user
router.get("/courses", asyncHandler(async (req, res) => {
  let courses = await Course.findAll({
    include: [{ model: User, }]
  });
  if (courses) {
    res.status(200).json(courses);
  } else {
    res.status(404).json({ message: "No courses exist." })
  }
}));

// Details for course and associated user
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const courses = await Course.findByPk(req.params.id, {
    include: [{ model: User, }]
  });
  if (courses) {
    res.status(200).json(courses);
  } else {
    res.status(404).json({ message: "Course not found." })
  }
}));

// Create a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  let courses;
  try {
    courses = await Course.create(req.body);
    // Set the location the url of the new course
    res.status(201).location(`/api/courses/${courses.id}`).end();
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Update the course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const courses = await Course.findByPk(req.params.id);
    if (courses) {
      await courses.update(req.body);
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map((err) => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
}));

// Delete course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const courses = await Course.findByPk(req.params.id);
  if (courses) {
    await courses.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Unable to find course' });
  }
}));


module.exports = router;