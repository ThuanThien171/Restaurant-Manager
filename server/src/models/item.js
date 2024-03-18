'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Item extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Item.belongsTo(models.Order, { foreignKey: 'orderID' })
            Item.belongsTo(models.Menu, { foreignKey: 'menuID' })
            Item.belongsTo(models.User, { foreignKey: 'staffID' })
        }
    }
    Item.init({
        orderID: DataTypes.INTEGER,
        menuID: DataTypes.INTEGER,
        staffID: DataTypes.INTEGER,
        itemNumber: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        note: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Item',
    });
    return Item;
};