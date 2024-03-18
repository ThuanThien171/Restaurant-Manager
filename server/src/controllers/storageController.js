const areaService = require('../services/areaService');
const storageService = require('../services/storageService');

//get all material with sum value and cost
let getAllStorageInfo = async (req, res) => {
    let storageData = await storageService.getAllStorageInfo(req.body.id);

    return res.status(200).json({
        errCode: storageData.errCode,
        errMessage: storageData.errMessage,
        storages: storageData.data ? storageData.data : {}
    })
}
//delete one material
let deleteOneMaterial = async (req, res) => {
    let materialDelete = await storageService.deleteOneMaterial(req.body.id);

    return res.status(200).json({
        errCode: materialDelete.errCode,
        errMessage: materialDelete.errMessage,
    })
}

let updateMaterial = async (req, res) => {
    let material = await storageService.updateMaterial(req.body.id, req.body.name, req.body.resID, req.body.measure);
    let storageData = {};
    if (material.errCode == 0) {
        storageData = await storageService.getAllStorageInfo(req.body.resID);
    }

    return res.status(200).json({
        errCode: material.errCode,
        errMessage: material.errMessage,
        storages: storageData.data ? storageData.data : {}
    })
}

let addMaterial = async (req, res) => {

    let material = await storageService.addMaterial(req.body.name, req.body.resID, req.body.measure);
    let storageData = {};
    if (material.errCode == 0) {
        storageData = await storageService.getAllStorageInfo(req.body.resID);
    }

    return res.status(200).json({
        errCode: material.errCode,
        errMessage: material.errMessage,
        storages: storageData.data ? storageData.data : {}
    })
}

let addStorage = async (req, res) => {
    let storage = await storageService.addStorage(req.body);
    let storageData = await storageService.getAllStorageInfo(req.body.id);
    return res.status(200).json({
        errCode: storage.errCode,
        errMessage: storage.errMessage,
        storages: storageData.data ? storageData.data : {}
    })
}

let getImportedInfo = async (req, res) => {
    let storageData = await storageService.getImportedInfo(req.body.id);
    return res.status(200).json({
        errCode: storageData.errCode,
        errMessage: storageData.errMessage,
        material: storageData.name,
        measure: storageData.measure,
        importedData: storageData.data ? storageData.data : {},
    })
}

let deleteImported = async (req, res) => {
    let id = req.body.id
    let areaData = await storageService.deleteImported(id);

    return res.status(200).json({
        errCode: areaData.errCode,
        errMessage: areaData.errMessage,
    })
}

let getMaterial = async (req, res) => {

    let materials = await storageService.getMaterial(req.body.id);

    return res.status(200).json({
        errCode: materials.errCode,
        errMessage: materials.errMessage,
        materials: materials.data ? materials.data : {}
    })
}

let getUsedMaterial = async (req, res) => {

    let materials = await storageService.getUsedMaterial(req.body.id);

    return res.status(200).json({
        errCode: materials.errCode,
        errMessage: materials.errMessage,
        materials: materials.data ? materials.data : {}
    })
}

let getCostData = async (req, res) => {

    let costData = await storageService.getCostData(req.body.id);

    return res.status(200).json({
        errCode: costData.errCode,
        errMessage: costData.errMessage,
        data: costData.data ? costData.data : {}
    })
}

let addNewCost = async (req, res) => {

    let newCost = await storageService.addNewCost(req.body);
    let costData = await storageService.getCostData(req.body.restaurantID);

    return res.status(200).json({
        errCode: newCost.errCode,
        errMessage: newCost.errMessage,
        data: costData.data ? costData.data : {}
    })
}

let deleteCost = async (req, res) => {

    let delCost = await storageService.deleteCost(req.body.id);
    let costData = await storageService.getCostData(req.body.restaurantID);

    return res.status(200).json({
        errCode: delCost.errCode,
        errMessage: delCost.errMessage,
        data: costData.data ? costData.data : {}
    })
}

module.exports = {
    getAllStorageInfo, deleteOneMaterial, updateMaterial,
    addMaterial, addStorage, getImportedInfo,
    deleteImported, getMaterial, getUsedMaterial,
    getCostData, addNewCost, deleteCost
};