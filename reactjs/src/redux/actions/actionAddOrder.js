function actionAddOrder(input) {
    const data = {
        tableID: input.tableID,
        orderID: input.orderID,
        action: input.action,
    }
    return {
        type: "ADD_ORDER",
        data: data,
    }
}

export default actionAddOrder