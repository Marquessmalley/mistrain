const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const AppError = require("../utills/appError");

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate email/password
    if (!email || !password) {
      return next(new AppError("Please provide email and password."), 400);
    }
    // run search query to find user
    const user = await User.findOne({ email: email }).select("+password");
    if (!user)
      return next(new AppError(`Email: ${email} cannot be found`, 401));

    // compare passwords
    const passwordMatch = await user.comparePasswords(password, user.password);
    if (!passwordMatch)
      return next(new AppError(`Password incorrect. Please try again`, 401));

    // assign user token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    res.status(200).json({
      status: "Success",
      message: "Thank for your credentials. logging in.",
      user: user,
      token: token,
    });
  } catch (err) {
    next(new AppError(err));
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    });

    // assign token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    res.status(201).json({
      status: "Success",
      message: "Thank for your credentials. logging in.",
      user: newUser,
      token: token,
    });
  } catch (err) {
    console.log(err);
    next(new AppError(err));
  }
};

module.exports.authenticateUser = async (req, res, next) => {
  console.log("yoo");
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    //2) validate the token, returns you the payload from the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // //3) check if user still existss
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User for this token does not exists", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(new AppError(err));
  }
};

module.exports.forgotPassword = (req, res, next) => {};
