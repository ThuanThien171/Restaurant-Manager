'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Area extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Area.hasMany(models.Table, { foreignKey: 'areaID' })
            Area.hasMany(models.StaffTask, { foreignKey: 'areaID' })
        }
    }
    Area.init({
        restaurantID: DataTypes.INTEGER,
        areaName: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Area',
    });
    return Area;
};