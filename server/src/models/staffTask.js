'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class StaffTask extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            StaffTask.belongsTo(models.Table, { foreignKey: 'tableID' })
            StaffTask.belongsTo(models.User, { foreignKey: 'userID' })
        }
    }
    StaffTask.init({
        tableID: DataTypes.INTEGER,
        userID: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'StaffTask',
    });
    return StaffTask;
};