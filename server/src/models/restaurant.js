'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Restaurant extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Restaurant.init({
        restaurantName: DataTypes.STRING,
        address: DataTypes.TEXT,
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Restaurant',
    });
    return Restaurant;
};