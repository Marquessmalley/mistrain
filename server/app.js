const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { globalErrorHandling } = require("./controllers/errorController");

const AppError = require("./utills/appError");
const app = express();

if (process.env.NODE_ENV === "developement") {
  console.log("App in development mode 💻");
  app.use(morgan("dev"));
}
if (process.env.NODE_ENV === "production")
  console.log("App in production mode 🎬");

// parses incoming json request
app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/user");
app.use("/account", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the requested url: ${req.url}`, 400));
});

app.use(globalErrorHandling);

module.exports = app;
