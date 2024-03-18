const db = require('../models/index');
const sequelize = require('sequelize');
const { Op } = require("sequelize");



let getAllStorageInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let materials = await db.Material.findAll({
                where: { restaurantID: id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                    include: [
                        [sequelize.fn('sum', sequelize.col('storages.importValue')), 'totalValue'],
                        [sequelize.fn('sum', sequelize.col('storages.materialCost')), 'totalCost'],
                    ]
                },
                include: [{
                    model: db.Storage,
                    attributes: [],
                    // required: true
                }],
                group: ['id'],
                raw: true,
                nest: true
            })
            // for (let i = 0; i < materials.length; i++) {
            //     let usedItem = await getUsedMaterial(materials[i].id);
            //     //console.log(usedItem);
            //     if (usedItem.data[0] != undefined) {
            //         for (let j = 0; j < usedItem.data.length; j++) {
            //             //console.log(usedItem.data[j].totalNumber);
            //             if (usedItem.data[j].totalNumber != undefined)
            //                 materials[i].totalValue -= usedItem.data[j].costValue * usedItem.data[j].totalNumber
            //             //usedItem.data[j].costValue * usedItem.data[j].totalNumber
            //         }
            //     }
            // }
            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = materials;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}
///chua sua
let deleteOneMaterial = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let material = await db.Material.findOne({
                where: { id: id }
            })
            if (material) {
                await db.Storage.destroy({
                    where: { materialID: id }
                })

                await db.MenuMaterial.destroy({
                    where: { materialID: id }
                })
                await material.destroy();
                result.errCode = 0;
                result.errMessage = "OK!";
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let updateMaterial = (id, name, resID, measure) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let material = await db.Material.findOne({
                where: { id: id },
            })
            if (material.materialName != name) {
                let sameMaterial = await db.Material.findOne({
                    where: {
                        restaurantID: resID,
                        materialName: name
                    },
                    raw: true
                });

                if (sameMaterial) {
                    result.errCode = 2;
                    result.errMessage = "Nguyên liệu này đã tồn tại!";
                } else {
                    material.materialName = name;
                    material.measure = measure;
                    await material.save();
                    result.errCode = 0;
                    result.errMessage = "OK!";

                }
            } else {
                if (material.measure == measure) {
                    result.errCode = 1;
                    result.errMessage = "Không có gì thay đổi!";
                } else {
                    material.measure = measure;
                    await material.save();
                    result.errCode = 0;
                }

            }


            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let addMaterial = (name, resID, measure) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let sameMaterial = await db.Material.findOne({
                where: {
                    restaurantID: resID,
                    materialName: name,
                },
                raw: true
            });

            if (sameMaterial) {
                result.errCode = 1;
                result.errMessage = "Nguyên liệu này đã tồn tại!";
            } else {
                if (!measure || !name) {
                    result.errCode = 2;
                    result.errMessage = "Chưa có đơn vị!";
                } else {
                    await db.Material.create({
                        restaurantID: resID,
                        materialName: name,
                        measure: measure
                    });
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

let addStorage = (storage) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            await db.Storage.create({
                materialID: storage.materialID,
                importValue: storage.importValue,
                materialCost: storage.materialCost,
                type: storage.type,
                note: storage.note
            });


            let material = await db.Material.findOne({
                where: { id: storage.materialID, }
            })
            if (material) {

                let updateMenu = await db.Menu.findAll({
                    where: { status: 2, restaurantID: material.restaurantID }
                }).then((items) => {
                    items.forEach((t) => {
                        t.update({ status: 1 });
                    });
                });
            }
            result.errCode = 0;
            result.errMessage = "OK!";

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getImportedInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let imported = await db.Storage.findAll({
                order: [
                    ['createdAt', 'DESC'],
                ],
                where: { materialID: id, type: 0 },
            })


            let material = await db.Material.findOne({
                where: { id: id },
            })
            result.name = material.materialName;
            result.measure = material.measure;
            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = imported;


            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteImported = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let imported = await db.Storage.findOne({
                where: { id: id },
            })
            if (imported) {
                await imported.destroy();
                result.errCode = 0;
                result.errMessage = "OK!";
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getMaterial = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let materials = await db.Material.findAll({
                where: { restaurantID: id },
                attributes: {
                    exclude: ['id', 'materialName', 'createdAt', 'updatedAt'],
                    include: [['materialName', 'label'], ['id', 'value']]
                },
                raw: true,
                nest: true
            })

            materials.map((data) => { delete data.restaurantID; })
            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = materials;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let checkStorage = (menu, resID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = true;

            let storageData = await getAllStorageInfo(resID);
            for (let i = 0; i < storageData.data.length; i++) {
                for (let j = 0; j < menu.materials.length; j++) {
                    //console.log(storageData.data[i].id == menu.materials[j].materialID);
                    if (storageData.data[i].id == menu.materials[j].materialID && (menu.number * menu.materials[j].costValue - storageData.data[i].totalValue) > 0) {

                        result = false;
                    }
                }
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getUsedMaterial = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let material = await db.MenuMaterial.findAll({
                where: { materialID: id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                    include: [
                        [sequelize.col('Menu.menuName'), 'menuName'],
                    ],
                },
                include: [{
                    model: db.Menu,
                    attributes: []
                    // required: true
                }],
                raw: true,
                nest: true,
            })

            for (let i = 0; i < material.length; i++) {
                let item = await db.Item.findAll({

                    where: {
                        menuID: material[i].menuID,
                        status: { [Op.or]: [1, 2] },

                    },
                    attributes: {
                        include: [
                            [sequelize.fn('sum', sequelize.col('itemNumber')), 'totalNumber'],
                        ],
                    },
                    include: [{
                        model: db.Order,
                        where: { status: { [Op.ne]: 2 } },
                        attributes: ['id', 'status']
                    }],
                    group: 'menuID',
                    raw: true,
                })
                //console.log(item);
                if (item[0]) {
                    material[i].totalNumber = parseInt(item[0].totalNumber);
                }
            }


            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = material;

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getCostData = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let costData = await db.Cost.findAll({
                where: { restaurantID: id },
                order: [
                    ['createdAt', 'DESC'],
                ],
                raw: true,
                nest: true,
            })

            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = costData;

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let addNewCost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            await db.Cost.create({
                restaurantID: data.restaurantID,
                fee: data.fee,
                costName: data.costName,
            });

            result.errCode = 0;
            result.errMessage = "OK!";

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteCost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            await db.Cost.destroy({
                where: { id: id }
            });

            result.errCode = 0;
            result.errMessage = "OK!";

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getAllStorageInfo, deleteOneMaterial, updateMaterial, addMaterial,
    addStorage, getImportedInfo, deleteImported, getMaterial,
    checkStorage, getUsedMaterial, getCostData, addNewCost, deleteCost
};