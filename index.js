const expressHandlebars = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const compression = require("compression");
const Handlebars = require("handlebars");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const express = require("express");
const csrf = require("csurf");
const path = require("path");

const { PORT, MONGO_DB_URI, SESSION_SECRET } =
  require("dotenv").config().parsed;

const varMiddleware = require("./middleware/variables");
const errorMiddleware = require("./middleware/error");
const userMiddleware = require("./middleware/user");
const fileMiddleware = require("./middleware/file");
const addProductRoute = require("./routes/addProduct");
const productsRoute = require("./routes/products");
const profileRoute = require("./routes/profile");
const ordersRoute = require("./routes/orders");
const authRoutes = require("./routes/auth");
const cartRoute = require("./routes/cart");
const homeRoute = require("./routes/home");

const app = express();

const hbs = expressHandlebars.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./utils/hbs-helpers.js"),
});

const store = new MongoStore({
  collection: "sessions",
  uri: MONGO_DB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  }),
);
app.use(fileMiddleware.single("avatar"));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(compression());
app.use(userMiddleware);

app.use("/add-product", addProductRoute);
app.use("/products", productsRoute);
app.use("/profile", profileRoute);
app.use("/orders", ordersRoute);
app.use("/auth", authRoutes);
app.use("/cart", cartRoute);
app.use("/", homeRoute);
app.use(errorMiddleware);

async function start() {
  try {
    await mongoose.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
    });

    app.listen(PORT || 3000);
  } catch (e) {
    console.log(e);
  }
}

start();
