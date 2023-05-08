const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const AppError = require("../utills/appError");
const sendEmail = require("../utills/sendEmail");
const crypto = require("crypto");

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

    const cookieOption = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      // secure: true,
      httpOnly: true,
    };

    res.cookie("jwt", token, cookieOption);

    res.status(200).json({
      status: "Success",
      message: "Thank for your credentials. logging in.",
      token: token,
      user: user,
    });
  } catch (err) {
    next(new AppError(err));
  }
};

module.exports.signup = async (req, res, next) => {
  try {
    // 1) RETRIEVE DATA FROM USER
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    // 2) CREATE USER
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    });

    // ASSIGN USER TOKEN
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    // 3) SET COOKIE
    const cookieOption = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      // secure: true,
      httpOnly: true,
      path: "/",
    };

    res.cookie("jwt", token, cookieOption);

    // 4) RESPOND TO CLIENT
    res.status(201).json({
      status: "Success",
      message: "Thank for your credentials. logging in.",
      token: token,
      user: newUser,
    });
  } catch (err) {
    next(new AppError(err));
  }
};

module.exports.signout = (req, res, next) => {
  //1) Clear the JWT cookie
  res.clearCookie("jwt");
  //2) Send a success response
  res.status(200).json({ message: "Signed out successfully" });
};

module.exports.authenticateUser = async (req, res, next) => {
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

module.exports.authorizeUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new AppError("User not authorized to access this resource: ", 401));
    }

    next();
  };
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) COLLECT EMAIL FROM USER
    const { email } = req.body;

    // 2) SEARCH USER && SAVE RANDOM TOKEN TO DB && SAVE
    const user = await User.findOne({ email: email });

    if (!user)
      return next(
        new AppError("User does not exists. Please try another email", 400)
      );
    const token = user.generateRandomToken();

    await user.save({ validateBeforeSave: false });

    // 3) SEND EMAIL TO USER

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/account/resetPassword/${token}`;

    const message = `Forgot your password? Submit a request to reset your password here ${resetUrl}`;

    await sendEmail(user.email, message);

    res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    next(new AppError(err));
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    // 1) RETRIEVE TOKEN FROM REQ
    const resetToken = crypto
      .createHash("SHA256")
      .update(req.params.token)
      .digest("hex");

    // 2) USE TOKEN TO FIND USER
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) return next(new AppError("Token is invalid or expired", 400));

    // 3) UPDATE PASSWORD && SAVE
    const { password, passwordConfirm } = req.body;
    user.password = password;
    user.passwordConfirm = passwordConfirm;

    await user.save();

    // 4) ASSIGN USER TOKEN
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    // 4) SET COOKIES
    const cookieOption = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      // secure: true,
      httpOnly: true,
    };

    res.cookie("jwt", token, cookieOption);

    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    next(new AppError(err));
  }
};
