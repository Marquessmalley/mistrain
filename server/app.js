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

// this serves my client app
// app.use(express.static(path.join(__dirname, "../client/build")));

// parses incoming json request
app.use(express.json());
app.use(cors());

// this renders my entire client app in one file.
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
app.use("/account", userRoutes);
app.use("/admin/dashboard", adminRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the requested url: ${req.url}`, 400));
});

app.use(globalErrorHandling);

module.exports = app;
