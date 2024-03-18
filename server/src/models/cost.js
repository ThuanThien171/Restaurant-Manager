'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cost extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Cost.init({
        restaurantID: DataTypes.INTEGER,
        costName: DataTypes.STRING,
        fee: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Cost',
    });
    return Cost;
};