const { Router } = require("express");

const auth = require("../middleware/auth");
const Order = require("../models/order");

const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId",
    );

    res.render("orders.hbs", {
      isOrder: true,
      title: "Orders",
      orders: orders.map((o) => ({
        ...o._doc,
        price: o.products.reduce((total, p) => {
          return (total += p.count * p.product.price);
        }, 0),
      })),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.productId");

    const products = user.cart.items.map((p) => ({
      count: p.count,
      product: { ...p.productId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user._id,
        // ToDo: id, _id
      },
      products: products,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
