const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 6,
    trim: true,
    //select property makes sure field wont show when getting user
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirm is required"],
  },
  resetPasswordToken: String,
  resetTokenExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // The purpose of the salt is to add an extra layer of security by making it more difficult for attackers
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = undefined;
  next();
});

// compare input password with stored hashed password
userSchema.methods.comparePasswords = async function (
  inputPassword,
  storedPassword
) {
  try {
    return await bcrypt.compare(inputPassword, storedPassword);
  } catch (err) {
    return err;
  }
};

// PASSWORD RESET TOKEN
userSchema.methods.generateRandomToken = function () {
  // generate random token
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  console.log(this.resetPasswordToken);

  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

module.exports.User = mongoose.model("User", userSchema);
