const { validationResult } = require("express-validator");
const { Router } = require("express");
const bcrypt = require("bcryptjs");

const { loginValidators, registerValidators } = require("../utils/validators");
const User = require("../models/user");

const router = Router();

router.get("/login", (req, res) => {
  res.render("auth/login.hbs", {
    title: "Authorization",
    isLogin: true,
    errorLogin: req.flash("errorLogin"),
    errorRegister: req.flash("errorRegister"),
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", loginValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("errorLogin", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("errorRegister", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hashPassword,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/auth/login#login");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
