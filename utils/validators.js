const { body } = require("express-validator");

const User = require("../models/user");

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
    }),
  body("password", "Enter valid password: 6-56 symbols")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric(),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords are not equal");
    }
    return true;
  }),
  body("name", "Enter valid name: minimum 3 symbols").isLength({ min: 3 }),
];
