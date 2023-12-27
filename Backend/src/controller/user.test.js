exports.allUsers = () => {
  const user = await Users.findAll({
    order: [["id", "ASC"]],
  });

  return {
    success: true,
    count: user.length,
    data: user,
  };
};

exports.registerUser = async (req) => {
  const { body } = req;

  const blogSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().required().min(6),
  });

  const { name, email, password } = await blogSchema.validateAsync(body);

  const userExists = await Users.findOne({where: {email: req.body.email}})

  if (userExists) {
    return {
      success: false,
      Error: `User ${userExists.name} already registered!`
    };
  }

  const user = await Users.create({
    name,
    email,
    password,
  });

  return {
    success: true,
    data: user,
    message: "User created successfully"
  };
};

exports.login = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return {
      success: false,
      Error: "Please provide an email and password",
      message: "Authentication failed"
    };
  }

  const user = await Users.findOne({ where: { email: req.body.email } });

  if (!user || user === null) {
    return {
      success: false,
      Error: "Invalid credential",
      message: "Authentication failed"
    };
  }

  const isMatch = await user.validPassword(password, user.password);

  if (!isMatch) {
    return {
      success: false,
      Error: "Incorrect Password",
      message: "Authentication failed"
    };
  }

  sendTokenResponse(user, 200, res);
};

exports.updateUser = async (req) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  await Users.update(fieldsToUpdate, {
    where: { id: req.user.id },
  });

  return {
    success: true,
    data: fieldsToUpdate,
    message: "User updated successfully"
  };
};

exports.updatePassword = async (req) => {
  const user = await Users.findByPk(req.user.id);

  if (!user || user === null) {
    return {
      success: false,
      Error: "Invalid credential",
      message: "Failed to update password"
    };
  }

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return {
      success: false,
      Error: "CurrentPassword is incorrect",
      message: "Failed to update password"
    };
  }

  user.password = req.body.newPassword;
  await user.save();

  return {
    success: true,
    newPassword: user.password,
    message: "Password updated successfully"
  };
};

exports.logout = async (req) => {
  const finderUser = await Users.findOne({
    where: { token: req.user.token },
  });
  if (!finderUser || finderUser == "null") {
    return {
      success: false,
      Error: `please login again!`,
      message: "Logout failed"
    };
  }

  finderUser.token = null;
  await finderUser.save();

  return {
    success: true,
    message: `logout User ${finderUser.name} successfully!`,
    message: "Logout successful"
  };
};

exports.sendTokenResponse = async (user, statusCode, res) => {
  const token = user.getSignedJwtToken(user.id);
  await Users.update({ token }, { where: { id: user.id } });
  return {
    success: true,
    token,
    user,
    message: "Login successful"
  };
};