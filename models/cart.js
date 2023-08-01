const path = require("path");
const fs = require("fs");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "database",
  "cart.json",
);

class Cart {
  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, "utf-8", (err, content) => {
        err ? reject(err) : resolve(JSON.parse(content));
      });
    });
  }

  static async add(product) {
    const cart = await Cart.fetch();

    const idx = cart.products.findIndex((item) => item.id === product.id);
    const existInCart = cart.products[idx];

    if (existInCart) {
      existInCart.count++;
      cart.products[idx] = existInCart;
    } else {
      product.count = 1;
      cart.products.push(product);
    }

    cart.price += +product.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(cart), (err) =>
        err ? reject(err) : resolve(),
      );
    });
  }

  static async remove(id) {
    const cart = await Cart.fetch();

    const idx = cart.products.findIndex((product) => product.id === id);
    const product = cart.products[idx];

    if (product.count === 1) {
      cart.products = cart.products.filter((product) => product.id !== id);
    } else {
      cart.products[idx].count--;
    }

    cart.price -= product.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(cart), (err) =>
        err ? reject(err) : resolve(cart),
      );
    });
  }
}

module.exports = Cart;
