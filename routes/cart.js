const { Router } = require("express");

const Product = require("../models/product.js");
const auth = require("../middleware/auth");

const router = Router();

function mapCartItems(cart) {
  return cart.items.map((p) => ({
    ...p.productId._doc,
    id: p.productId.id,
    count: p.count,
  }));
}

function computePrice(products) {
  return products.reduce((total, product) => {
    return (total += product.price * product.count);
  }, 0);
}

router.get("/", auth, async (req, res) => {
  const user = await req.user.populate("cart.items.productId");

  const products = mapCartItems(user.cart);

  res.render("cart.hbs", {
    title: "Cart",
    isCart: true,
    products: products,
    price: computePrice(products),
  });
});

router.post("/add", auth, async (req, res) => {
  const product = await Product.findById(req.body.id);
  await req.user.addToCart(product);
  res.redirect("/cart");
});

router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.productId");

  const products = mapCartItems(user.cart);
  const cart = {
    products,
    price: computePrice(products),
  };

  res.json(cart);
});

module.exports = router;
