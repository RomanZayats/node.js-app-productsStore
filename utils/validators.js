const { body } = require("express-validator");

const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Enter valid email")
    .custom(async (value) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (candidate) {
          return Promise.reject("User with this email already exist");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Enter valid password: 6-56 symbols")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("passwordConfirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords are not equal");
      }
      return true;
    })
    .trim(),
  body("name", "Enter valid name: minimum 3 symbols")
    .isLength({ min: 3 })
    .trim(),
];
exports.loginValidators = [
  body("email").isEmail().withMessage("Enter valid email").normalizeEmail(),
  body("password", "Enter valid password: 6-56 symbols")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .custom(async (value, { req }) => {
      try {
        const candidate = await User.findOne({ email: req.body.email });

        if (!candidate) {
          return Promise.reject("No user found. Register first");
        }

        if (candidate) {
          const areSame = await bcrypt.compare(value, candidate.password);
          if (!areSame) {
            return Promise.reject("Incorrect password");
          } else {
            req.session.user = candidate;
            req.session.isAuthenticated = true;
            req.session.save((err) => {
              if (err) throw err;
              req.res.redirect("/");
            });
          }
        }
      } catch (e) {
        console.log(e);
      }
    })
    .trim(),
];
