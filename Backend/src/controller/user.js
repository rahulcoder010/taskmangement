const Joi = require("joi");
const db = require("../models/index.js");
const Users = db.User;

// ALL USER
exports.allUsers = async (req, res) => {
  try {
    const user = await Users.findAll({
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: user.length,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

// REGISTER USER
exports.registerUser = async (req, res, next) => {
  try {
    const { body } = req;

    const userSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      password: Joi.string().required().min(6),
    });

    const { name, email, password } = await userSchema.validateAsync(body);

    const userExists = await Users.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({
        success: false,
        Error: `User ${userExists.name} already registered!`,
      });
    }

    const user = await Users.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
      message: "Failed to create user",
    });
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      Error: "Please provide an email and password",
      message: "Authentication failed",
    });
  }

  const user = await Users.findOne({ where: { email: req.body.email } });

  if (!user || user === null) {
    return res.status(401).json({
      success: false,
      Error: "Invalid credential",
      message: "Authentication failed",
    });
  }

  const isMatch = await user.validPassword(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      Error: "Incorrect Password",
      message: "Authentication failed",
    });
  }

  sendTokenResponse(user, 200, res);
};

// UPDATE USER
exports.updateUser = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    await Users.update(fieldsToUpdate, {
      where: { id: req.user.id },
    });

    res.status(200).json({
      success: true,
      data: fieldsToUpdate,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
      message: "Failed to update user",
    });
  }
};

// UPDATE PASSWORD
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await Users.findByPk(req.user.id);

    if (!user || user === null) {
      return res.status(401).json({
        success: false,
        Error: "Invalid credential",
        message: "Failed to update password",
      });
    }

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        Error: "CurrentPassword is incorrect",
        message: "Failed to update password",
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(201).json({
      success: true,
      newPassword: user.password,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
      message: "Failed to update password",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const finderUser = await Users.findOne({
      where: { token: req.user.token },
    });
    if (!finderUser || finderUser == "null") {
      return res.status(400).json({
        success: false,
        Error: `please login again!`,
        message: "Logout failed",
      });
    }

    finderUser.token = null;
    await finderUser.save();

    res.status(201).json({
      success: true,
      message: `logout User ${finderUser.name} successfully!`,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
      message: "Logout failed",
    });
  }
};

// CREATE TOKEN & SEND RESPONSE
const sendTokenResponse = async (user, statusCode, res) => {
  const token = user.getSignedJwtToken(user.id);
  res.status(statusCode).json({
    success: true,
    token,
    user,
    message: "Login successful",
  });
  await Users.update({ token }, { where: { id: user.id } });
};