const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  getUserInfo,
  validateJwt,
} = require("../controllers/userController");

const router = express.Router();

// Validation middleware for user registration
const validateUserRegistration = [
  check("username").not().isEmpty().withMessage("Username is required"),

  check("email").isEmail().withMessage("Invalid email"),
  check("phone_number").not().isEmpty().withMessage("Phone number is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation middleware for user login
const validateUserLogin = [
  check("email").isEmail().withMessage("Invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);
router.get("/userinfo", validateJwt, getUserInfo);

module.exports = router;
