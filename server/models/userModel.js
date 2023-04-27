const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
});

userSchema.pre("save", async function (next) {
  try {
    // The purpose of the salt is to add an extra layer of security by making it more difficult for attackers
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    this.passwordConfirm = undefined;
    next();
  } catch (err) {
    console.log(err);
  }
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

module.exports.User = mongoose.model("User", userSchema);
