'use strict';
const { Model, DataTypes } = require('sequelize');

class Task extends Model {
  static associate(models) {
    // define association here
  }
}

Task.init({
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  status: DataTypes.ENUM('pending', 'In_Progress', 'completed')
});

module.exports = Task;