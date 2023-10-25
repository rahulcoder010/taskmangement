const jwt = require("jsonwebtoken");
const {User} = require("../models/index");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      Error: "Not authorized to access this route",
    });
  }

  try {
    const decoded = jwt.verify(token, "kevinchodvadiya");

    req.user = await User.findByPk(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      Error: "Not authorized to access this route",
    });
  }
};
