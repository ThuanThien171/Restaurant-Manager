const orderService = require('../services/orderService');

let getOrderRealTime = async (req, res) => {

    let orderData = await orderService.getOrderRealTime(req.body.id)
        .then(async (orderData) => {
            for (let i = 0; i < orderData.data.length; i++) {
                orderData.data[i].totalPrice = await orderService.getTotalPrice(orderData.data[i].id);
            }
            return orderData;
        }
        );

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        data: orderData.data ? orderData.data : {}
    })

}

let addNewOrder = async (req, res) => {

    let orderData = await orderService.addNewOrder(req.body)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,

    })

}

let getOrderInfo = async (req, res) => {

    let orderData = await orderService.getOrderInfo(req.body)
        .then(async (orderData) => {
            // if (orderData.items) {
            //     orderData.data.totalPrice = 0;
            //     for (let i = 0; i < orderData.items.length; i++) {
            //         orderData.items[i].itemNumber = parseInt(orderData.items[i].itemNumber);
            //         orderData.data.totalPrice += orderData.items[i].itemNumber * orderData.items[i].price
            //     }
            //     //console.log(orderData.data.totalPrice);
            // }
            //console.log(orderData);
            if (orderData.data) {
                orderData.data.totalPrice = await orderService.getTotalPrice(orderData.data.id);

            }
            return orderData;
        }
        );

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        items: orderData.items ? orderData.items : {},
        data: orderData.data ? orderData.data : {}
    })

}

let cancelOrder = async (req, res) => {

    let orderData = await orderService.cancelOrder(req.body.id)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
    })

}

let paymentOrder = async (req, res) => {

    let orderData = await orderService.paymentOrder(req.body.id)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
    })

}

let updateOrder = async (req, res) => {

    let orderData = await orderService.updateOrder(req.body)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,

    })

}

let addMenuToOrder = async (req, res) => {
    req.body.id = req.body.tableID;
    // console.log(req.body)
    if (req.body.tableID != undefined) {
        let order = await orderService.getOrderInfo(req.body)
        req.body.orderID = order.data.id;
    }
    let orderData = await orderService.addMenuToOrder(req.body)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,

    })

}

let getUnserveItem = async (req, res) => {

    let orderData = await orderService.getUnserveItem(req.body.id)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        data: orderData.data ? orderData.data : {}
    })

}

let getKitchenInfo = async (req, res) => {

    let orderData = await orderService.getKitchenInfo(req.body.id)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        data: orderData.data ? orderData.data : {}
    })

}

let updateItem = async (req, res) => {
    let data = [];
    let orderData = await orderService.updateItem(req.body.id)
    if (req.body.tableID != undefined) {
        let unserve = await orderService.getUnserveItem(req.body.tableID);
        data = unserve.data;
    }

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        data: data,
    })

}

let deleteItem = async (req, res) => {
    let data = [];
    let orderData = await orderService.deleteItem(req.body.id)
    if (req.body.tableID != undefined) {
        let unserve = await orderService.getUnserveItem(req.body.tableID);
        data = unserve.data;
    }
    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        data: data,
    })

}

let changeTable = async (req, res) => {

    let orderData = await orderService.changeTable(req.body)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,

    })

}

let splitOrder = async (req, res) => {

    let orderData = await orderService.splitOrder(req.body)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,

    })

}

let getHistoryInfo = async (req, res) => {

    let orderData = await orderService.getHistoryInfo(req.body.id)
        .then(async (orderData) => {
            for (let i = 0; i < orderData.data.length; i++) {
                orderData.data[i].totalPrice = await orderService.getTotalPrice(orderData.data[i].id);
            }
            return orderData;
        }
        );

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        data: orderData.data ? orderData.data : {}
    })

}

let getOrderHistory = async (req, res) => {

    let orderData = await orderService.getOrderHistory(req.body.orderID)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        data: orderData.data ? orderData.data : {}
    })

}

let deleteOrder = async (req, res) => {

    let orderData = await orderService.deleteOrder(req.body.id)
    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
    })

}

let getBarChartData = async (req, res) => {

    let orderData = await orderService.getBarChartData(req.body)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        data: orderData.data ? orderData.data : {}
    })

}

let getLineChartData = async (req, res) => {

    let orderData = await orderService.getLineChartData(req.body)

    return res.status(200).json({
        errCode: orderData.errCode,
        errMessage: orderData.errMessage,
        data: orderData.data ? orderData.data : {}
    })

}

module.exports = {
    getOrderRealTime, addNewOrder, getOrderInfo,
    cancelOrder, paymentOrder, updateOrder,
    addMenuToOrder, getUnserveItem, getKitchenInfo,
    updateItem, deleteItem, changeTable, splitOrder,
    getHistoryInfo, getOrderHistory, deleteOrder,
    getBarChartData, getLineChartData
};