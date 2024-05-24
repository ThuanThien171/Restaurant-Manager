const db = require('../models/index');
const sequelize = require('sequelize');



let getAllArea = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let areas = await db.Area.findAll({
                where: { restaurantID: id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                    include: [
                        [sequelize.fn('COUNT', sequelize.col('Tables.id')), 'totalTable'],
                    ]

                },
                include: [{
                    model: db.Table,
                    attributes: [],
                    // required: true
                }],
                group: ['id'],
                raw: true,
                nest: true
            })
            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = areas;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteOneArea = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let area = await db.Area.findOne({
                where: { id: id }
            })
            if (area) {
                let inUseTable = await db.Table.findOne({
                    where: { areaID: id, status: 1 }
                });
                if (inUseTable) {
                    result.errCode = 1;
                    result.errMessage = "Có bàn đang được sử dụng!";
                } else {
                    await db.Table.destroy({
                        where: { areaID: id }
                    });
                    await area.destroy();
                    result.errCode = 0;
                    result.errMessage = "OK!";
                }
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let postNewArea = (name, number, resID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let sameNameInRes = await db.Area.findOne({
                where: {
                    restaurantID: resID,
                    areaName: name
                }
            });
            if (sameNameInRes) {
                result.errCode = 1;
                result.errMessage = "Tên khu đã tồn tại!";
            } else {
                let newArea = await db.Area.create({
                    restaurantID: resID,
                    areaName: name,
                });
                for (let i = 0; i < number; i++) {
                    await db.Table.create({
                        areaID: newArea.id,
                        tableName: `${name}-${i + 1}`,
                        status: 0
                    });
                }
                result.errCode = 0;
                result.errMessage = "Thêm thành công!";
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getOneAreaInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let tables = await db.Table.findAll({
                where: { areaID: id },
                raw: true
            })
            let area = await db.Area.findOne({
                where: { id: id },
                raw: true
            })
            if (area) {

                result.errCode = 0;
                result.errMessage = "OK!";
                result.areaName = area.areaName;
                result.data = tables;

            } else {
                result.errCode = 2;
                result.errMessage = "Area not exist!";
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let changeNameArea = (id, newName, resID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let sameNameInRes = await db.Area.findOne({
                where: {
                    restaurantID: resID,
                    areaName: newName
                }
            });
            if (sameNameInRes) {
                result.errCode = 1;
                result.errMessage = "Tên khu đã tồn tại!";
            } else {
                let area = await db.Area.findOne({
                    where: { id: id },
                })
                if (area) {
                    area.areaName = newName;
                    await area.save();
                    result.errCode = 0;
                    result.errMessage = "OK!";
                }
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let changeNameTable = (id, newName, areaID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let sameNameInArea = await db.Table.findOne({
                where: {
                    areaID: areaID,
                    tableName: newName,
                }
            });
            if (sameNameInArea) {
                result.errCode = 1;
                result.errMessage = "Tên bàn đã tồn tại!";
            } else {
                let table = await db.Table.findOne({
                    where: { id: id },
                })
                if (table) {
                    table.tableName = newName;
                    await table.save();
                    result.errCode = 0;
                    result.errMessage = "OK!";
                }
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteTable = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let table = await db.Table.findOne({
                where: { id: id },
            })

            if (table.status == 0) {
                await table.destroy();
                result.errCode = 0;
                result.errMessage = "OK!";
            } else {
                result.errCode = 1;
                result.errMessage = "Bàn đang được dùng!";
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let addTable = (areaID, tableName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let tables = await db.Table.findOne({
                where: { areaID: areaID, tableName: tableName },
                raw: true
            })

            if (tables) {
                result.errCode = 1;
                result.errMessage = "Table's name alredy exist!";
            } else {
                await db.Table.create({
                    areaID: areaID,
                    tableName: tableName,
                    status: 0
                });
                result.errCode = 0;
                result.errMessage = "OK!";
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getAvailableTable = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let areas = await db.Area.findAll({
                where: { restaurantID: id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                    include: [
                        // [sequelize.col('tables.tableName'), 'tableName'],
                        // [sequelize.col('tables.status'), 'status'],
                        // [sequelize.col('tables.id'), 'tableID'],
                    ]

                },
                // include: [{
                //     model: db.Table,
                //     attributes: {
                //         exclude: ['createdAt', 'updatedAt'],
                //     },

                //     //required: true
                // }],
                //group: ['id'],
                raw: true,
                nest: true
            }).then(async (areas) => {
                for (let i = 0; i < areas.length; i++) {
                    areas[i].tables = await db.Table.findAll({
                        where: { areaID: areas[i].id },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                        raw: true
                    })
                };
                result.errCode = 0;
                result.errMessage = "OK!";
                result.data = areas;
                resolve(result);
            });




        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getAllArea, deleteOneArea, postNewArea, getOneAreaInfo, changeNameArea, changeNameTable, deleteTable, addTable, getAvailableTable
};