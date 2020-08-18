const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const formidable = require('express-formidable');
const mongoose = require("mongoose");

const restaurantsRoutes = require("./routes/restaurants");
const reviewsRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");

const app = express();

mongoose
  .connect(
    "mongodb+srv://chan:" + process.env.MONGO_ATLAS_PW +"@cluster0-uqtcp.mongodb.net/Zomato?retryWrites=true&w=majority"
    ,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  )
  .then(() => {
    console.log("Connection Established..!");
  })
  .catch(() => {
    console.log("Connection Not Established..!");
  });

  // app.use(formidable());
  app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: true }));
  // app.use(bodyParser.raw());
  app.use("/Data",express.static(path.join("backend/Data")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/restaurants", restaurantsRoutes);

app.use("/api/reviews", reviewsRoutes);

app.use("/api/user", userRoutes);

app.use("/api/menu", menuRoutes);

app.use("/api/orders", orderRoutes);

module.exports = app;
