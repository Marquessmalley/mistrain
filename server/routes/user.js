const express = require("express");
const {
  login,
  signup,
  signout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/signout", signout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

module.exports = router;
