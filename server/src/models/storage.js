'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Storage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Storage.belongsTo(models.Material, { foreignKey: 'materialID' })
        }
    }
    Storage.init({
        materialID: DataTypes.INTEGER,
        importValue: DataTypes.FLOAT,
        materialCost: DataTypes.INTEGER,
        type: DataTypes.INTEGER,
        note: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Storage',
    });
    return Storage;
};