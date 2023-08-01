const { Schema, model } = require("mongoose");

const product = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imgURL: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

product.method("toClient", function () {
  const product = this.toObject();

  product.id = product._id;
  delete product._id;

  return product;
});

module.exports = model("Product", product);

// const {v4: uuidv4} = require('uuid')
// const path = require('node:path')
// const fs = require('node:fs')
//
// class Product {
//     constructor(title, price, imgURL) {
//         this._id = uuidv4()
//         this._title = title
//         this._price = price
//         this._imgURL = imgURL
//     }
//
//     async save() {
//         const productsList = await Product.getAllProducts()
//         productsList.push({
//             id: this._id,
//             title: this._title,
//             price: this._price,
//             imgURL: this._imgURL,
//         })
//
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'database', 'products.json'),
//                 JSON.stringify(productsList),
//                 (err) => err ? reject(err) : resolve()
//             )
//         })
//     }
//
//     static async update(product) {
//         const productsList = await Product.getAllProducts()
//         const idx = productsList.findIndex(item => item.id === product.id)
//         productsList[idx] = product
//
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'database', 'products.json'),
//                 JSON.stringify(productsList),
//                 (err) => err ? reject(err) : resolve()
//             )
//         })
//     }
//
//     static getAllProducts() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'database', 'products.json'),
//                 'utf-8',
//                 (err, content) => err ? reject(err) : resolve(JSON.parse(content))
//             )
//         })
//     }
//
//     static async getByID(id) {
//         const products = await Product.getAllProducts()
//         return products.find(item => item.id === id)
//     }
// }
//
// module.exports = Product
