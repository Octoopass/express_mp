require("dotenv").config();

// express
const express = require("express");
const app = express();
// package
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");

// routers
const accountRoute = require("./routes/accountRoutes");
const transactionPointRoute = require("./routes/transactionPointRoutes");
const hubRoute = require("./routes/hubRoutes");
const orderRoute = require("./routes/orderRoutes");
const shippingOrderRoute = require("./routes/shippingOrderRoutes");
const transactionOrderRoute = require("./routes/transactionOrderRoutes")

// var path = require("path");

const { CORS_URLS } = require("../constants/config");

// app.set("views", path.join(__dirname, "/views"));
// app.set("view engine", "ejs");
app.use(cookieParser());
app.use(morgan("combined"));
app.use(
  cors({
    origin: CORS_URLS,
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "../public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies);

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies);

  res.send();
});

app.use("/accounts", accountRoute);
app.use("/transactionPoint", transactionPointRoute);
app.use("/hub", hubRoute);
app.use("/orders", orderRoute);
app.use("/shippingOrders", shippingOrderRoute);
app.use("/transactionOrders", transactionOrderRoute);

// error (not yet)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).send({
    message: "Something went wrong!",
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
