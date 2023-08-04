const { Router } = require("express");

const User = require("../models/user");

const router = Router();

router.get("/login", (req, res) => {
  res.render("auth/login.hbs", {
    title: "Authorization",
    isLogin: true,
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  req.session.user = await User.findById("64c0ef9769e114feb4edce50");
  req.session.isAuthenticated = true;
  req.session.save((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

module.exports = router;
