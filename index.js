const expressHandlebars = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const session = require("express-session");
const Handlebars = require("handlebars");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const { PORT, MONGO_USER, MONGO_PW, MONGO_CLUSTER, MONGO_DB_NAME } =
  require("dotenv").config().parsed;

const varMiddleware = require("./middleware/variables");
const addProductRoute = require("./routes/addProduct");
const productsRoute = require("./routes/products");
const ordersRoute = require("./routes/orders");
const authRoutes = require("./routes/auth");
const cartRoute = require("./routes/cart");
const homeRoute = require("./routes/home");

const app = express();

const hbs = expressHandlebars.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "some secret value",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(varMiddleware);

app.use("/add-product", addProductRoute);
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/auth", authRoutes);
app.use("/cart", cartRoute);
app.use("/", homeRoute);

async function start() {
  try {
    const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_CLUSTER}.mongodb.net/${MONGO_DB_NAME}`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
    });

    app.listen(PORT || 3000);
  } catch (e) {
    console.log(e);
  }
}

start();
