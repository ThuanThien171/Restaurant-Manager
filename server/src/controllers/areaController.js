const areaService = require('../services/areaService');


let getAllArea = async (req, res) => {
    let areaData = await areaService.getAllArea(req.body.id);

    return res.status(200).json({
        errCode: areaData.errCode,
        errMessage: areaData.errMessage,
        areas: areaData.data ? areaData.data : {}
    })
}

let deleteOneArea = async (req, res) => {
    let id = req.body.id;
    let areaDelete = await areaService.deleteOneArea(id);

    return res.status(200).json({
        errCode: areaDelete.errCode,
        errMessage: areaDelete.errMessage,
    })
}

let postNewArea = async (req, res) => {
    let newArea = await areaService.postNewArea(req.body.name, req.body.number, req.body.resID);
    let areaData = {};
    if (newArea.errCode === 0) {
        areaData = await areaService.getAllArea(req.body.resID);
    }
    return res.status(200).json({
        errCode: newArea.errCode,
        errMessage: newArea.errMessage,
        areas: areaData.data ? areaData.data : {}
    })
}

let getOneAreaInfo = async (req, res) => {
    let id = req.body.id;
    let areaData = await areaService.getOneAreaInfo(id);

    return res.status(200).json({
        errCode: areaData.errCode,
        errMessage: areaData.errMessage,
        areaName: areaData.areaName ? areaData.areaName : '',
        tables: areaData.data ? areaData.data : {}
    })
}
//
let changeNameArea = async (req, res) => {
    let id = req.body.id;
    let newName = req.body.name;
    let resID = req.body.resID;;
    let updateArea = await areaService.changeNameArea(id, newName, resID);

    return res.status(200).json({
        errCode: updateArea.errCode,
        errMessage: updateArea.errMessage,
    })
}

let changeNameTable = async (req, res) => {
    let id = req.body.id;
    let newName = req.body.name;
    let areaID = req.body.areaID;
    let updateTable = await areaService.changeNameTable(id, newName, areaID);
    let areaData = {};
    if (updateTable.errCode === 0) {
        areaData = await areaService.getOneAreaInfo(areaID);
    }

    return res.status(200).json({
        errCode: updateTable.errCode,
        errMessage: updateTable.errMessage,
        tables: areaData.data ? areaData.data : {}
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

    let newTable = await areaService.addTable(req.body.areaID, req.body.tableName);
    let areaData = {};
    if (newTable.errCode === 0) {
        areaData = await areaService.getOneAreaInfo(req.body.areaID);
    }


    return res.status(200).json({
        errCode: newTable.errCode,
        errMessage: newTable.errMessage,
        tables: areaData.data ? areaData.data : {}
    })
}

let getAvailableTable = async (req, res) => {

    let table = await areaService.getAvailableTable(req.body.id);

    return res.status(200).json({
        errCode: table.errCode,
        errMessage: table.errMessage,
        areas: table.data ? table.data : {}
    })
}

module.exports = { getAllArea, deleteOneArea, postNewArea, getOneAreaInfo, changeNameArea, changeNameTable, deleteTable, addTable, getAvailableTable };