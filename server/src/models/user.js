'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Item, { foreignKey: 'staffID' })
      User.hasOne(models.StaffTask, { foreignKey: 'userID' })
    }
  }
  User.init({
    restaurantID: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    phone: DataTypes.STRING(20),
    password: DataTypes.STRING,
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};