'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MenuMaterial extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            MenuMaterial.belongsTo(models.Material, { foreignKey: 'materialID' })
            MenuMaterial.belongsTo(models.Menu, { foreignKey: 'menuID' })
        }
    }
    MenuMaterial.init({
        menuID: DataTypes.INTEGER,
        materialID: DataTypes.INTEGER,
        costValue: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'MenuMaterial',
    });
    return MenuMaterial;
};