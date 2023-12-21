"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static associate(models) {
    // define association here
  }
}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "User",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

User.prototype.validPassword = async (password, newPassword) => {
  return await bcrypt.compareSync(password, newPassword);
};

User.prototype.getSignedJwtToken = function (id) {
  return jwt.sign({ id }, "kevinchodvadiya");
};

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;