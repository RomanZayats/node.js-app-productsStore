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

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, repeat } = req.body;

    const candidate = await User.findOne({ email });
    if (candidate) {
      res.redirect("/auth/login#register");
    } else {
      const user = new User({ email, name, password, cart: { items: [] } });
      await user.save();
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
