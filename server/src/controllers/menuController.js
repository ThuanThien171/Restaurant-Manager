const areaService = require('../services/areaService');
const menuService = require('../services/menuService');

let getAllMenu = async (req, res) => {
    let menuData = await menuService.getAllMenu(req.body.id);

    return res.status(200).json({
        errCode: menuData.errCode,
        errMessage: menuData.errMessage,
        menus: menuData.data ? menuData.data : {}
    })
}

let deleteOneMenu = async (req, res) => {
    let id = req.body.id;
    let menuDelete = await menuService.deleteOneMenu(id);

    return res.status(200).json({
        errCode: menuDelete.errCode,
        errMessage: menuDelete.errMessage,
    })
}

let postNewMenu = async (req, res) => {
    let newMenu = req.body;
    let menuData = await menuService.postNewMenu(newMenu);

    return res.status(200).json({
        errCode: menuData.errCode,
        errMessage: menuData.errMessage,
    })
}

let getMenuDetail = async (req, res) => {
    let id = req.body.id;
    let menuData = await menuService.getMenuDetail(id);

    return res.status(200).json({
        errCode: menuData.errCode,
        errMessage: menuData.errMessage,
        menu: menuData.menu,
        data: menuData.data ? menuData.data : {}
    })
}

let updateMenu = async (req, res) => {
    let menuData = await menuService.updateMenu(req.body);

    return res.status(200).json({
        errCode: menuData.errCode,
        errMessage: menuData.errMessage,
    })
}
//
let changeStatusMenu = async (req, res) => {
    let id = req.body.id;
    let menu = await menuService.changeStatusMenu(id);

    return res.status(200).json({
        errCode: menu.errCode,
        errMessage: menu.errMessage,

    })
}

let deleteTable = async (req, res) => {
    let id = req.body.id
    let areaData = await areaService.deleteTable(id);

    return res.status(200).json({
        errCode: areaData.errCode,
        errMessage: areaData.errMessage,
    })
}

let addTable = async (req, res) => {

    let areaData = await areaService.addTable(req.body.areaID, req.body.tableName);

    return res.status(200).json({
        errCode: areaData.errCode,
        errMessage: areaData.errMessage,
    })
}

module.exports = { getAllMenu, deleteOneMenu, postNewMenu, getMenuDetail, updateMenu, changeStatusMenu };