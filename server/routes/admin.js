const express = require("express");
const {
  authenticateUser,
  authorizeUser,
} = require("../controllers/authController");
const router = express.Router();

router.get(
  "/",
  authenticateUser,
  authorizeUser("admin", "developer"),
  (req, res, next) => {
    res.status(200).json({
      message: "Welcome to the protected admin page",
    });
  }
);

module.exports = router;
