const db = require('../models/index');
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');
const storageService = require('./storageService');

let getOrderRealTime = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let orders = await db.Order.findAll({
                where: { restaurantID: id, status: 0 },
                attributes: {
                    exclude: ['updatedAt'],
                    include: [
                        [sequelize.col('Table.tableName'), 'tableName'],
                    ]
                },
                include: [{
                    model: db.Table,
                    as: 'Table',
                    attributes:['id', 'tableName'],
                    include: [{
                        model: db.StaffTask,
                        as: 'StaffTask',
                        attributes: ['tableID', 'userID'],
                    }],
                    nest: true,
                    raw: true,
                    // required: true
                },
                ],
                group: ['id'],
                raw: true,
                nest: true
            })

            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = orders;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getTotalPrice = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            let items = await db.Item.findAll({
                where: { orderID: id, },
                attributes: [
                    'orderID', 'status',
                    [sequelize.col('Menu.price'), 'price'],
                    [sequelize.fn('sum', sequelize.col('itemNumber')), 'totalItem']
                ]
                ,
                include: [{
                    model: db.Menu,
                    //as: 'Table',
                    attributes: [],
                    // required: true
                },
                ],
                group: ['menuID'],
                raw: true,
                nest: true
            });

            //////// old design
            // let cancelItems = await db.Item.findAll({
            //     where: { orderID: id, status: 2 },
            //     attributes: [
            //         'orderID', 'status',
            //         [sequelize.col('Menu.price'), 'price'],
            //         [sequelize.fn('sum', sequelize.col('itemNumber')), 'totalItem']
            //     ]
            //     ,
            //     include: [{
            //         model: db.Menu,
            //         //as: 'Table',
            //         attributes: [],
            //         // required: true
            //     },
            //     ],
            //     group: ['menuID'],
            //     raw: true,
            //     nest: true
            // });

            let result = 0;
            items.map((data) => {
                result += data.price * data.totalItem;
            })

            // cancelItems.map((data) => {
            //     result -= data.price * data.totalItem;
            // });

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let addNewOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            // let inValidItem = [];

            // for (let i = 0; i < data.menus.length; i++) {
            //     data.menus[i].materials = await db.MenuMaterial.findAll({
            //         where: { menuID: data.menus[i].id },
            //         raw: true
            //     })

            // }
            // for (let i = 0; i < data.menus.length; i++) {
            //     if (data.menus[i].materials[0] != undefined) {
            //         let check = await storageService.checkStorage(data.menus[i], data.resID);
            //         if (check == false) inValidItem.push({ name: data.menus[i].data.menuName, number: data.menus[i].number, id: data.menus[i].id });
            //     }
            // }

            // if (inValidItem[0] == undefined) {
            let newOrder = await db.Order.create({
                restaurantID: data.resID,
                tableID: data.tableID,
                staff: data.staff,
                status: 0,
            })

            let updateTable = await db.Table.findOne({
                where: { id: data.tableID, }
            })
            if(updateTable.status != 1) {
                updateTable.status = 1;
                await updateTable.save();
                //console.log(data)
                for (let i = 0; i < data.menus.length; i++) {
                    await db.Item.create({
                        orderID: newOrder.id,
                        menuID: data.menus[i].id,
                        staffID: data.userID,
                        itemNumber: data.menus[i].number,
                        status: 0,
                        note: data.menus[i].note,
                    })

                    // if (data.menus[i].materials[0] != undefined) {
                    //     for (let j = 0; j < data.menus[i].materials.length; j++) {
                    //         await db.Storage.create({
                    //             materialID: data.menus[i].materials[j].materialID,
                    //             importValue: -data.menus[i].materials[j].costValue * data.menus[i].number,
                    //             materialCost: 0,
                    //             type: newOrder.id,//để xóa khi hủy đơn
                    //             note: "\"" + data.menus[i].data.menuName + "\" x " + data.menus[i].number,
                    //         })
                    //     }
                    // }
                }

                result.errCode = 0;
                result.errMessage = "OK!";
            }else {
                result.errCode = 1;
                result.errMessage = "Bàn đã được dùng";
            }
            // } else {
            //     for (let i = 0; i < inValidItem.length; i++) {
            //         if (inValidItem[0].number == 1) {
            //             let updateMenu = await db.Menu.findOne({
            //                 where: { id: inValidItem[i].id, }
            //             })
            //             updateMenu.status = 2;
            //             await updateMenu.save();
            //         }
            //     }
            //     result.errCode = 1;
            //     result.errMessage = "Không đủ món: ";
            //     inValidItem.map((data) => { result.errMessage += data.name + ", " })

            // }

            //console.log(inValidItem)
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}


let getOrderInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let orders = {}
            if (data.orderID == undefined) {
                orders = await db.Order.findOne({
                    where: { tableID: data.id, status: 0 },
                    attributes: {
                        //exclude: ['updatedAt'],
                        include: [
                            [sequelize.col('Table.tableName'), 'tableName'],
                        ]
                    },
                    include: [{
                        model: db.Table,
                        attributes: [],
                        // required: true
                    },],
                    //group: ['id'],
                    raw: true,
                    nest: true
                })
            } else {
                orders = await db.Order.findOne({
                    where: { id: data.orderID },
                    attributes: {
                        //exclude: ['updatedAt'],
                        include: [
                            [sequelize.col('Table.tableName'), 'tableName'],
                        ]
                    },
                    include: [{
                        model: db.Table,
                        attributes: [],
                        // required: true
                    },],
                    //group: ['id'],
                    raw: true,
                    nest: true
                })
            }
            if (orders) {
                let items = await db.Item.findAll({
                    where: {
                        orderID: orders.id,
                    },

                    attributes: {
                        exclude: ['itemNumber', 'note', 'createdAt', 'updatedAt'],
                        include: [
                            [sequelize.col('Menu.menuName'), 'menuName'],
                            [sequelize.col('Menu.image'), 'image'],
                            [sequelize.col('Menu.price'), 'price'],
                            [sequelize.fn('sum', sequelize.col('itemNumber')), 'itemNumber']
                        ]
                    },
                    include: {
                        model: db.Menu,
                        //as: 'Menus',
                        attributes: [],
                        //required: true

                    },
                    group: ['menuID'],
                    raw: true,
                    //nest: true
                })

                for (let i = items.length - 1; i >= 0; i--) {

                    items[i].itemNumber = parseInt(items[i].itemNumber);
                    //console.log(items);

                    if (items[i].itemNumber == 0) items.splice(i, 1);

                }


                result.errCode = 0;
                result.errMessage = "OK!";
                result.items = items;
                result.data = orders;
            }


            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let cancelOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let orders = await db.Order.findOne({
                where: { id: id },
                //group: ['id'],
                //raw: true,
                //nest: true
            })
            if (orders) {
                let table = await db.Table.findOne({
                    where: {
                        id: orders.tableID,
                    },
                    //group: ['menuID'],
                    //raw: true,
                    //nest: true
                })

                orders.status = 2;
                await orders.save();

                table.status = 0;
                await table.save();

                await db.Item.destroy({
                    where: { orderID: id, status: { [Op.or]: [0, 3] } },
                })

                // let items = await db.Item.findAll({
                //     where: { orderID: id, status: 0 },

                // }).then((items) => {
                //     items.forEach((t) => {
                //         t.update({ status: 1 });
                //     });
                // });


                result.errCode = 0;
                result.errMessage = "OK!";
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let paymentOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let orders = await db.Order.findOne({
                where: { id: id },
                //group: ['id'],
                //raw: true,
                //nest: true
            })
            if (orders) {
                let table = await db.Table.findOne({
                    where: {
                        id: orders.tableID,
                    },
                    //group: ['menuID'],
                    //raw: true,
                    //nest: true
                })

                // update order
                orders.status = 1;
                await orders.save();

                // update table
                table.status = 0;
                await table.save();

                //update item 
                // let items = await db.Item.findAll({
                //     where: { orderID: id, status: 0 },
                //     //group: ['id'],
                //     //raw: true,
                //     //nest: true
                // }).then((items) => {
                //     items.forEach((t) => {
                //         t.update({ status: 1 });
                //     });
                // });



                result.errCode = 0;
                result.errMessage = "OK!";
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let updateOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};

            for (let i = 0; i < data.menus.length; i++) {
                await db.Item.create({
                    orderID: data.orderID,
                    menuID: data.menus[i].menuID,
                    staffID: data.staffID,
                    itemNumber: data.menus[i].itemNumber,
                    status: 0,
                    note: "",
                })
            }


            result.errCode = 0;
            result.errMessage = "OK!";
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let addMenuToOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            for (let i = 0; i < data.menus.length; i++) {
                await db.Item.create({
                    orderID: data.orderID,
                    menuID: data.menus[i].id,
                    staffID: data.userID,
                    itemNumber: data.menus[i].number,
                    status: 0,
                    note: data.menus[i].note ? data.menus[i].note : "...",
                })
            }


            result.errCode = 0;
            result.errMessage = "OK!";
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getUnserveItem = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let order = await db.Order.findOne({
                where: { tableID: id, status: 0 }
            })
            if (order) {

                let items = await db.Item.findAll({
                    where: {
                        orderID: order.id,
                        status: {
                            [Op.or]: [0, 3]
                        }
                    },

                    attributes: {
                        //exclude: ['createdAt', 'updatedAt'],
                        include: [
                            [sequelize.col('Menu.menuName'), 'menuName'],
                        ]
                    },
                    include: {
                        model: db.Menu,
                        attributes: [],
                    },
                    //group: ['menuID'],
                    raw: true,
                    //nest: true
                })

                result.errCode = 0;
                result.errMessage = "OK!";
                result.data = items;

            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getKitchenInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let order = await db.Order.findAll({
                where: { restaurantID: id, status: 0 },
                attributes: ["id", "restaurantID", "status",
                    [sequelize.col('Table.tableName'), 'tableName'],
                ],
                include: {
                    model: db.Table,
                    attributes: []
                },
                // order: [
                //     ['createdAt', 'DESC'],
                // ],
                raw: true,
            })
            if (order[0] != undefined) {
                for (let i = 0; i < order.length; i++) {

                    order[i].item = await db.Item.findAll({
                        where: {
                            orderID: order[i].id,
                            status: 0,
                        },

                        attributes: {
                            exclude: ['updatedAt'],
                            include: [
                                [sequelize.col('Menu.menuName'), 'menuName'],
                            ]
                        },
                        include: {
                            model: db.Menu,
                            attributes: [],
                        },
                        //group: ['menuID'],
                        raw: true,
                        //nest: true
                    })

                }


                result.errCode = 0;
                result.errMessage = "OK!";
                result.data = order;

            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let updateItem = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};

            let item = await db.Item.findOne({
                where: { id: id },
            })
            if (item) {
                if (item.status == 0) item.status = 3;
                else if (item.status == 3) item.status = 1;
                await item.save();

                result.errCode = 0;
                result.errMessage = "OK!";
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteItem = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};

            await db.Item.destroy({
                where: { id: id }
            })
            result.errCode = 0;
            result.errMessage = "OK!";
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let changeTable = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let newTable = await db.Table.findOne({
                where: { id: data.tableID }
            })
            if (newTable) {
                if (newTable.status == 0) {

                    let order = await db.Order.findOne({
                        where: { id: data.orderID }
                    })

                    order.tableID = data.tableID;
                    await order.save();

                    let oldTable = await db.Table.findOne({
                        where: { id: data.oldTable }
                    })
                    oldTable.status = 0;
                    await oldTable.save();

                    newTable.status = 1;
                    await newTable.save();

                    result.errCode = 0;
                    result.errMessage = "OK!";
                } else {
                    result.errCode = 1;
                    result.errMessage = "Bàn đã được dùng";
                }
            }


            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let splitOrder = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = {};
            let newTable = await db.Table.findOne({
                where: { id: data.newTableID }
            })
            if (newTable) {
                if (newTable.status == 0) {

                    let newOrder = await db.Order.create({
                        restaurantID: data.resID,
                        staff: data.staff,
                        status: 0,
                        tableID: newTable.id,
                    })

                    newTable.status = 1;
                    await newTable.save();

                    for (let i = 0; i < data.menu.length; i++) {
                        data.menu[i].splitNumber = parseInt(data.menu[i].splitNumber);
                        if (data.menu[i].splitNumber != 0) {

                            await db.Item.create({
                                orderID: newOrder.id,
                                menuID: data.menu[i].menuID,
                                staffID: data.userID,
                                itemNumber: data.menu[i].splitNumber,
                                status: 1,
                                note: "",
                            })

                            await db.Item.create({
                                orderID: data.orderID,
                                menuID: data.menu[i].menuID,
                                staffID: data.userID,
                                itemNumber: -data.menu[i].splitNumber,
                                status: 2,
                                note: "tách đơn",
                            })

                        }


                    }


                    result.errCode = 0;
                    result.errMessage = "OK!";
                } else {
                    result.errCode = 1;
                    result.errMessage = "Bàn đã được dùng";
                }
            }


            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getHistoryInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let orders = await db.Order.findAll({
                where: { restaurantID: id, status: { [Op.ne]: 0 } },
                attributes: {
                    include: [
                        [sequelize.col('Table.tableName'), 'tableName'],
                    ]
                },
                include: [{
                    model: db.Table,
                    as: 'Table',
                    attributes: [],
                    // required: true
                },
                ],
                order: [
                    ['updatedAt', 'DESC'],
                ],
                group: ['id'],
                raw: true,
                nest: true
            })

            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = orders;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getOrderHistory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let items = await db.Item.findAll({
                where: {
                    orderID: id,
                },
                attributes: {
                    exclude: ["updatedAt"],
                    include: [
                        [sequelize.col('Menu.menuName'), 'menuName'],
                        [sequelize.col('User.userName'), 'staff'],
                    ],
                },
                include: [
                    {
                        model: db.Menu,
                        attributes: [],
                    }, {
                        model: db.User,
                        attributes: [],
                    },
                ],
                order: [
                    ['updatedAt', 'DESC'],
                ],
                raw: true,
            })

            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = items,
                resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};

            await db.Order.destroy({
                where: { id: id }
            })
            await db.Item.destroy({
                where: { orderID: id }
            })

            result.errCode = 0;
            result.errMessage = "OK!";
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

//sale
let getSaleData = (resID, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            let saleData = [];
            for (let i = 1; i <= 12; i++) {
                // lay data doanh thu
                let totalSale = 0;
                let orders = await db.Order.findAll({
                    where: {
                        restaurantID: resID,
                        status: 1,
                        [Op.and]: [
                            //sequelize.fn(''),
                            sequelize.where(sequelize.fn('MONTH', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), i),
                            sequelize.where(sequelize.fn('YEAR', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), year),
                        ],
                    },
                    raw: true,
                })
                for (let j = 0; j < orders.length; j++) {
                    let orderPrice = await getTotalPrice(orders[j].id);
                    totalSale += orderPrice;
                }
                saleData.push(totalSale);
            }
            resolve(saleData);
        } catch (e) {
            reject(e);
        }
    })
}

//material cost
let getMaterialCostData = (resID, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            let materialData = [];
            for (let i = 1; i <= 12; i++) {
                let totalMaterialCost = 0;
                let materials = await db.Material.findAll({
                    where: { restaurantID: resID },
                    attributes: ['id', 'restaurantID'],
                    raw: true,
                })
                for (let j = 0; j < materials.length; j++) {
                    let importedData = await db.Storage.findAll({
                        where: {
                            materialID: materials[j].id,
                            type: 0,
                            [Op.and]: [
                                //sequelize.fn(''),
                                sequelize.where(sequelize.fn('MONTH', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), i),
                                sequelize.where(sequelize.fn('YEAR', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), year),
                            ],
                        },
                        attributes: [
                            [sequelize.fn('sum', sequelize.col('materialCost')), 'totalCost'],

                        ],
                        group: "materialID",
                        raw: true
                    })
                    if (importedData[0] != undefined)
                        totalMaterialCost += parseInt(importedData[0].totalCost);
                    //console.log(importedData)
                }
                materialData.push(totalMaterialCost);
            }
            resolve(materialData);
        } catch (e) {
            reject(e);
        }
    })
}
//other cost
let getCostData = (resID, year) => {
    return new Promise(async (resolve, reject) => {
        try {
            let costData = [];
            for (let i = 1; i <= 12; i++) {
                let ortherCost = await db.Cost.findAll({
                    where: {
                        restaurantID: resID,
                        [Op.and]: [
                            //sequelize.fn(''),
                            sequelize.where(sequelize.fn('MONTH', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), i),
                            sequelize.where(sequelize.fn('YEAR', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), year),
                        ],
                    },
                    attributes: [
                        [sequelize.fn('sum', sequelize.col('fee')), 'totalFee'],

                    ],
                    group: "restaurantID",
                    raw: true
                })
                if (ortherCost[0] != undefined) {
                    costData.push(parseInt(ortherCost[0].totalFee));
                } else {
                    costData.push(0);
                }
            }
            resolve(costData);
        } catch (e) {
            reject(e);
        }
    })
}

let getBarChartData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let saleData = [];
            let materialData = [];
            let costData = [];
            let month = [1,2,3,4,5,6,7,8,9,10,11,12];

            const promis = month.map(async (i) => {
                // lay data doanh thu
                let totalSale = 0;
                let orders = await db.Order.findAll({
                    where: {
                        restaurantID: data.resID,
                        status: 1,
                        [Op.and]: [
                            //sequelize.fn(''),
                            sequelize.where(sequelize.fn('MONTH', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), i),
                            sequelize.where(sequelize.fn('YEAR', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), data.year),
                        ],
                    },
                    raw: true,
                })
                for (let j = 0; j < orders.length; j++) {
                    let orderPrice = await getTotalPrice(orders[j].id);
                    totalSale += orderPrice;
                }
                saleData[i] = totalSale;


                //lay data chi phi nguyen lieu
                let totalMaterialCost = 0;
                let materials = await db.Material.findAll({
                    where: { restaurantID: data.resID },
                    attributes: ['id', 'restaurantID'],
                    raw: true,
                })
                for (let j = 0; j < materials.length; j++) {
                    let importedData = await db.Storage.findAll({
                        where: {
                            materialID: materials[j].id,
                            type: 0,
                            [Op.and]: [
                                //sequelize.fn(''),
                                sequelize.where(sequelize.fn('MONTH', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), i),
                                sequelize.where(sequelize.fn('YEAR', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), data.year),
                            ],
                        },
                        attributes: [
                            [sequelize.fn('sum', sequelize.col('materialCost')), 'totalCost'],

                        ],
                        group: "materialID",
                        raw: true
                    })
                    if (importedData[0] != undefined)
                        totalMaterialCost += parseInt(importedData[0].totalCost);
                    //console.log(importedData)
                }
                materialData[i] = totalMaterialCost;

                //lay data cac chi phi khac
                let ortherCost = await db.Cost.findAll({
                    where: {
                        restaurantID: data.resID,
                        [Op.and]: [
                            //sequelize.fn(''),
                            sequelize.where(sequelize.fn('MONTH', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), i),
                            sequelize.where(sequelize.fn('YEAR', sequelize.fn('CONVERT_TZ', sequelize.col('updatedAt'), '+00:00', '+07:00')), data.year),
                        ],
                    },
                    attributes: [
                        [sequelize.fn('sum', sequelize.col('fee')), 'totalFee'],

                    ],
                    group: "restaurantID",
                    raw: true
                })
                if (ortherCost[0] != undefined) {
                    costData[i] = parseInt(ortherCost[0].totalFee);
                } else {
                    costData[i] = 0;
                }
            })

            await Promise.all(promis);
            // let saleData = await getSaleData(data.resID, data.year);
            // let materialData = await getMaterialCostData(data.resID, data.year);
            // let costData = await getCostData(data.resID, data.year);
            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = { saleData, materialData, costData };
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getLineChartData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let date = new Date();
            let predate = new Date();
            predate.setDate(date.getDate() - 6);
            let lineChartData = [];
            //lay ra 3 mon duoc goi nhieu nhat trong 7 ngay
            let items = await db.Item.findAll({
                where: {
                    status: { [Op.or]: [1, 2] },

                },
                attributes: {
                    include: [
                        [sequelize.fn('sum', sequelize.col('itemNumber')), 'totalNumber'],
                        [sequelize.col('Menu.menuName'), 'menuName'],
                    ],
                },
                include: [{
                    model: db.Order,
                    attributes: ['id', 'restaurantID', 'status'],
                    where: {
                        restaurantID: data.resID, status: 1,
                        updatedAt: {
                            [Op.between]: [predate, date],
                        }
                    },
                }, {
                    model: db.Menu,
                    attributes: [],
                }
                ],
                group: 'menuID',
                order: [[sequelize.col('totalNumber'), "DESC"]],
                raw: true,
                nest: true,
                limit: 3,
            })

            //console.log(items)
            for (let i = 0; i < items.length; i++) {
                let menuData = await getItemnumberIn7Day(items[i].menuID, data.resID);
                lineChartData.push({ name: items[i].menuName, data: menuData });
            }


            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = lineChartData;
            //result.data = await getItemnumberIn7Day(items[0].menuID, data.resID);
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getItemnumberIn7Day = (menuID, resID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = [];
            for (let i = 6; i >= 0; i--) {
                let date = new Date();
                let predate = new Date();
                
                predate.setDate(date.getDate() - i);
                let totalNumberInDay = 0;

                let orders = await db.Order.findAll({
                    where: {
                        status: 1,
                        restaurantID: resID,
                        [Op.and]: [
                            sequelize.where(sequelize.fn('DAY',  sequelize.col('updatedAt')), predate.getDate()),
                            sequelize.where(sequelize.fn('MONTH',  sequelize.col('updatedAt')), (predate.getMonth() + 1)),
                            sequelize.where(sequelize.fn('YEAR', sequelize.col('updatedAt')), predate.getFullYear()),
                        ],
                    },

                    raw: true,
                    nest: true,
                })
                for (let j = 0; j < orders.length; j++) {
                    let items = await db.Item.findAll({
                        where: {
                            menuID: menuID, orderID: orders[j].id,
                            status: { [Op.or]: [1, 2] },
                        },
                        attributes: {
                            include: [
                                [sequelize.fn('sum', sequelize.col('itemNumber')), 'totalNumber'],
                            ],
                        },
                        group: "menuID",
                        raw: true,
                    })
                    //console.log(items);
                    if (items[0] != undefined) totalNumberInDay += parseInt(items[0].totalNumber);
                }
                result.push(totalNumberInDay);

            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getOrderRealTime, getTotalPrice, addNewOrder,
    getOrderInfo, paymentOrder, cancelOrder,
    updateOrder, addMenuToOrder, getUnserveItem,
    getKitchenInfo, updateItem, deleteItem, changeTable,
    splitOrder, getHistoryInfo, getOrderHistory,
    deleteOrder, getBarChartData, getLineChartData
};