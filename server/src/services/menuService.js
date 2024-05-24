const db = require('../models/index');
const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

let getAllMenu = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let menus = await db.Menu.findAll({
                where: { restaurantID: id },
                raw: true
            })
            result.errCode = 0;
            result.errMessage = "OK!";
            result.data = menus;
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let deleteOneMenu = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let menu = await db.Menu.findOne({
                where: { id: id }
            })
            if (menu) {
                await db.MenuMaterial.destroy({
                    where: { menuID: id }
                })
                await menu.destroy();
                result.errCode = 0;
                result.errMessage = "OK!";
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let postNewMenu = (newMenu) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let sameNameInRes = await db.Menu.findOne({
                where: {
                    restaurantID: newMenu.restaurantID,
                    menuName: newMenu.menuName

                }
            });
            if (sameNameInRes) {
                result.errCode = 1;
                result.errMessage = "Đã có món này!";
            } else {

                let menu = await db.Menu.create({
                    restaurantID: newMenu.restaurantID,
                    menuName: newMenu.menuName,
                    image: newMenu.image,
                    status: newMenu.status,
                    price: newMenu.price,
                });
                if (newMenu.costData != '[]') {
                    console.log(newMenu.costData);
                    newMenu.costData.map(async (data) => {
                        await db.MenuMaterial.create({
                            menuID: menu.id,
                            materialID: data.value,
                            costValue: (data.costValue > 0) ? data.costValue : 0
                        });
                    })

                }
                result.errCode = 0;
                result.errMessage = "OK!";
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getMenuDetail = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let menu = await db.Menu.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                raw: true
            })
            let menuRelation = await db.MenuMaterial.findAll({
                where: { menuID: id },

                include: [{
                    model: db.Material,
                    as: 'Material',
                    attributes: [],
                    // required: true
                }],
                attributes: {
                    exclude: ['materialID', 'createdAt', 'updatedAt'],
                    include: [['materialID', 'value'],
                    [sequelize.col('Material.materialName'), 'label'],
                    [sequelize.col('Material.measure'), 'measure']]
                },
                raw: true
            })
            menuRelation.map((data) => { delete data.id; delete data.menuID; });

            if (menu) {

                result.errCode = 0;
                result.errMessage = "OK!";
                result.menu = menu;
                result.data = menuRelation;

            } else {
                result.errCode = 2;
                result.errMessage = "Không tồn tại!";
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}



let updateMenu = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let sameNameInRes = "";
            if (data.menuName != "") {
                sameNameInRes = await db.sequelize.query('SELECT * FROM Menus WHERE restaurantID = :id AND menuName = :name ',
                    {
                        replacements: { id: data.restaurantID, name: data.menuName },
                        type: QueryTypes.SELECT
                    })
            }
            //console.log(sameNameInRes);

            if (sameNameInRes == '') {
                let menu = await db.Menu.findOne({
                    where: { id: data.id },
                })
                if (menu) {
                    await db.MenuMaterial.destroy({
                        where: { menuID: data.id },

                    });
                    if (data.costData != "") {
                        data.costData.map(async (item) => {
                            await db.MenuMaterial.create({
                                menuID: data.id,
                                materialID: item.value,
                                costValue: (item.costValue > 0) ? item.costValue : 0
                            });
                        })


                    }
                    menu.menuName = (data.menuName != "") ? data.menuName : menu.menuName;
                    menu.image = data.image;
                    menu.status = data.status;
                    menu.price = data.price;
                    await menu.save();
                    result.errCode = 0;
                    result.errMessage = "OK!";
                }
            } else {
                result.errCode = 1;
                result.errMessage = "Đã có món này!";
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let changeStatusMenu = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let menu = await db.Menu.findOne({
                where: { id: id },
            })
            if (menu) {
                (menu.status == 1) ? menu.status = 2 : menu.status = 1;
                await menu.save();

                result.errCode = 0;
                result.errMessage = "OK!";
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
            if (table) {
                await table.destroy();
                result.errCode = 0;
                result.errMessage = "OK!";
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

module.exports = { getAllMenu, deleteOneMenu, postNewMenu, getMenuDetail, updateMenu, changeStatusMenu };