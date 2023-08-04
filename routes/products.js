const { Router } = require("express");

const Product = require("../models/product");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    // const products = await Product.getAllProducts()
    res.render("products.hbs", {
      title: "Products",
      isProducts: true,
      products,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    // const product = await Product.getByID(req.params.id)
    res.render("product.hbs", {
      layout: "empty",
      title: `Product ${product.title}`,
      product,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id/edit", auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  try {
    const product = await Product.findById(req.params.id);
    // const product = await Product.getByID(req.params.id)

    res.render("edit-product.hbs", {
      title: `Edit ${product.title}`,
      product,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", auth, async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;
    await Product.findByIdAndUpdate(id, req.body);
    // await Product.update(req.body)
    res.redirect("/products");
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.body.id });
    res.redirect("/products");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
