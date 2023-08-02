const expressHandlebars = require("express-handlebars");
const envFile = require("dotenv").config().parsed;
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const addProductRoute = require("./routes/addProduct");
const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");
const cartRoute = require("./routes/cart");
const homeRoute = require("./routes/home");
const User = require("./models/user");

const app = express();

const hbs = expressHandlebars.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("64c0ef9769e114feb4edce50");
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/add-product", addProductRoute);
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/cart", cartRoute);
app.use("/", homeRoute);

async function start() {
  try {
    const uri = `mongodb+srv://${envFile.MONGO_USER}:${envFile.MONGO_PW}@${envFile.MONGO_CLUSTER}.mongodb.net/${envFile.MONGO_DB_NAME}`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
    });

    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: "rzayats@ukr.net",
        name: "rzayats",
        cart: {
          items: [],
        },
      });
      await user.save();
    }

    app.listen(process.env.PORT || 3000);
  } catch (e) {
    console.log(e);
  }
}

start();
