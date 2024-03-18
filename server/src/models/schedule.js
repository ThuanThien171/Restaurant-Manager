'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Schedule.init({
        restaurantID: DataTypes.INTEGER,
        userID: DataTypes.INTEGER,
        areaID: DataTypes.INTEGER,
        shiftID: DataTypes.INTEGER,
        check: DataTypes.BOOLEAN,
        date: DataTypes.DATEONLY
    }, {
        sequelize,
        modelName: 'Schedule',
    });
    return Schedule;
};