'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Menu extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Menu.hasMany(models.Item, { foreignKey: 'menuID' })
            Menu.hasMany(models.MenuMaterial, { foreignKey: 'menuID' })
        }
    }
    Menu.init({
        restaurantID: DataTypes.INTEGER,
        menuName: DataTypes.STRING,
        image: DataTypes.STRING,
        status: DataTypes.INTEGER,
        price: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Menu',
    });
    return Menu;
};