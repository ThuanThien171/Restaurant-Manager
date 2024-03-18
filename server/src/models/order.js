'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Order.belongsTo(models.Table, { foreignKey: 'tableID' })
            Order.hasMany(models.Item, { foreignKey: 'orderID' })
            // define association here
        }
    }
    Order.init({
        restaurantID: DataTypes.INTEGER,
        tableID: DataTypes.INTEGER,
        staff: DataTypes.STRING,
        status: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};