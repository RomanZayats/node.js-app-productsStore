const { validationResult } = require("express-validator");
const { Router } = require("express");

const { productValidators } = require("../utils/validators");
const Product = require("../models/product");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", auth, (req, res) => {
  res.render("add-product.hbs", {
    title: "Add Product",
    isAddProduct: true,
  });
});

router.post("/", auth, productValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("add-product.hbs", {
      title: "Add Product",
      isAddProduct: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        imgURL: req.body.imgURL,
      },
    });
  }

  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imgURL: req.body.imgURL,
    userId: req.user._id,
  });

  try {
    await product.save();
    res.redirect("/products");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
