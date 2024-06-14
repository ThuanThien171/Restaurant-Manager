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
                },
                raw: true,
                nest: true
            })
            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = materials;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

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
                        measure: measure,
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
                importValue: parseFloat(storage.importValue),
                materialCost: parseFloat(storage.materialCost),
                type: storage.type,
                note: storage.note
            });


            let material = await db.Material.findOne({
                where: { id: storage.materialID, }
            })
            if (material) {
                material.value += parseFloat(storage.importValue);
                await material.save();
            }

            result.errCode = 0;
            result.errMessage = "OK!";

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getImportedInfo = (id,start,end) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let lastCheck = await db.Storage.findOne({
                where:{
                    type: 3,
                    updatedAt: {
                        [Op.between]: [start, `${end} 23:59:59`]
                    },
                },
                order: [
                    ['updatedAt', 'DESC'],
                ],
                raw: true,
            })
            let date = new Date(lastCheck.updatedAt);
            let month = date.getMonth()+1;
            let day = date.getDate();
            let hour = date.getHours()+7;
            let m = date.getMinutes();
            let s = date.getSeconds();
            let convert = `${date.getFullYear()}-${month<10?`0${month}`: month}-${day<10?`0${day}`: day} ${hour<10?`0${hour}`: hour}:${m<10?`0${m}`: m}:${s<10?`0${s}`: s}`
            console.log(convert);
            let imported = await db.Storage.findAll({
                where: { 
                    materialID: id,
                    updatedAt: {
                        [Op.between]: [start, `${end} 23:59:59`]
                    },
                },
                attributes: {
                    include: [ 
                        [sequelize.fn('date_format',sequelize.col('updatedAt'),'%Y-%m-%d'),'date'],
                        [sequelize.fn('sum',sequelize.literal('CASE WHEN type = 0 THEN importValue ELSE 0 END')),'importedValue'],
                        [sequelize.fn('sum',sequelize.literal('CASE WHEN type = 0 THEN materialCost ELSE 0 END')),'totalCost'],
                        [sequelize.fn('sum',sequelize.literal('CASE WHEN type = 1 THEN importValue ELSE 0 END')),'usedValue'],
                        [sequelize.fn('sum',sequelize.literal('CASE WHEN type = 1 THEN importValue ELSE 0 END')),'usedValue'],
                        [sequelize.fn('sum',sequelize.literal('CASE WHEN type = 2 THEN importValue ELSE 0 END')),'diffValue'],
                        [sequelize.fn('sum',sequelize.literal(`CASE WHEN type = 3 AND updatedAt = '${convert}' THEN importValue ELSE 0 END`)),'baseValue'],
                    ],
                    exclude:['createdAt', 'updatedAt']
                },
                order: [
                    [sequelize.fn('date_format',sequelize.col('updatedAt'),'%Y-%m-%d'), 'DESC'],
                ],
                group: [
                    sequelize.fn('date_format',sequelize.col('updatedAt'),'%Y-%m-%d')
                ]
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

let getImportedInDay = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let imported = await db.Storage.findAll({
                where :{
                    materialID: id,
                    updatedAt: {
                        [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`]
                    },
                    type: 0
                },
                attributes: {
                    include: [
                        [sequelize.fn('date_format',sequelize.col('updatedAt'),'%H:%i:%s'),'time'],
                    ],
                    export: ['createdAt','updatedAt'],
                }
            })
            result.errCode = 0;
            result.errMessage = "OK!";
            result.data=imported;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getUsedInDay = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let used = await db.Storage.findAll({
                where :{
                    materialID: id,
                    updatedAt: {
                        [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`]
                    },
                    type: 1
                },
                attributes: {
                    include: [
                        [sequelize.fn('sum',sequelize.col('importValue')),'value'],
                        [sequelize.fn('date_format',sequelize.col('updatedAt'),'%H:%i:%s'),'time'],
                        [sequelize.fn('sum',sequelize.literal(`CAST(SUBSTRING_INDEX(note ,' món ',1) as DECIMAL)`)),'num'],
                        [sequelize.fn('SUBSTRING_INDEX',sequelize.col('note'),' món ',-1),'menuName'],
                    ],
                    exclude:['importValue','materialCost','note','createdAt','updatedAt']
                },
                group: [
                    sequelize.fn('date_format',sequelize.col('updatedAt'),'%H:%i:%s'),
                ],
            })


            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = used;

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

let updateStorage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            const promis = data.map( async (data)=> {
                if(data.value != 0){
                    await addStorage({
                        materialID: data.id,
                        importValue: parseFloat(data.value),
                        materialCost: 0,
                        type: 2, ///chênh lệch với lượng thực tế
                        note: data.value > 0 ? 'dư thừa':'hao hụt'
                    });
                }
                await db.Storage.create({
                    materialID: data.id,
                    importValue: +parseFloat(data.total+data.value).toFixed(2),
                    materialCost: 0,
                    type: 3, /// lượng tồn kho do máy tính toán
                    note: 'tồn kho'
                });
            })

            await Promise.all(promis);

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
    addStorage, getImportedInfo, getImportedInDay, getMaterial,
    getUsedInDay, getCostData, addNewCost, deleteCost,
    updateStorage,
};