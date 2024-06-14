const express = require('express');
const { homeController, fbController } = require('../controllers/homeController');
const userController = require('../controllers/userController');
const areaController = require('../controllers/areaController');
const menuController = require('../controllers/menuController');
const storageController = require('../controllers/storageController');
const orderController = require('../controllers/orderController');
// import controller


const router = express.Router();

//method router.method('/route',handler)
//test
router.get('/', homeController);
//router.get('/a', fbController);
router.post('/b', fbController);


//user api
router.post('/api/login', userController.handleLogin);
router.post('/api/signup', userController.handleSignup);
router.post('/api/getAllStaff', userController.getAllStaff);
router.post('/api/addNewUser', userController.addNewUser);
router.post('/api/updateUserByAdmin', userController.updateUserByAdmin);
router.post('/api/deleteUser', userController.deleteUser);
router.post('/api/changePass', userController.changePass);
router.post('/api/getResInfo', userController.getResInfo);
router.post('/api/updateRes', userController.updateRes);
router.post('/api/updateProfile', userController.updateProfile);

//area-table api
router.post('/api/getAllArea', areaController.getAllArea);
router.post('/api/deleteOneArea', areaController.deleteOneArea);
router.post('/api/postNewArea', areaController.postNewArea);
router.post('/api/getOneAreaInfo', areaController.getOneAreaInfo);
router.post('/api/changeNameArea', areaController.changeNameArea);
router.post('/api/changeNameTable', areaController.changeNameTable);
router.post('/api/deleteTable', areaController.deleteTable);
router.post('/api/addTable', areaController.addTable);
router.post('/api/getAvailableTable', areaController.getAvailableTable);
router.post('/api/deleteStaffTask', areaController.deleteStaffTask);
router.post('/api/updateStaffTask', areaController.updateStaffTask);
router.post('/api/getAllStaffTask', areaController.getAllStaffTask);

//menu api
router.post('/api/getAllMenu', menuController.getAllMenu);
router.post('/api/deleteOneMenu', menuController.deleteOneMenu);
router.post('/api/postNewMenu', menuController.postNewMenu);
router.post('/api/getMenuDetail', menuController.getMenuDetail);
router.post('/api/updateMenu', menuController.updateMenu);
router.post('/api/changeStatusMenu', menuController.changeStatusMenu);
router.post('/api/getDataTable', menuController.getDataTable);

//storage-material api
router.post('/api/getAllStorageInfo', storageController.getAllStorageInfo);
router.post('/api/getMaterial', storageController.getMaterial);
router.post('/api/deleteOneMaterial', storageController.deleteOneMaterial);
router.post('/api/updateMaterial', storageController.updateMaterial);
router.post('/api/addMaterial', storageController.addMaterial);
router.post('/api/addStorage', storageController.addStorage);
router.post('/api/getImportedInfo', storageController.getImportedInfo);
router.post('/api/getCostData', storageController.getCostData);
router.post('/api/addNewCost', storageController.addNewCost);
router.post('/api/deleteCost', storageController.deleteCost);
router.post('/api/updateStorage', storageController.updateStorage);
router.post('/api/getImportedInDay', storageController.getImportedInDay);
router.post('/api/getUsedInDay', storageController.getUsedInDay);

//order api
router.post('/api/getOrderRealTime', orderController.getOrderRealTime);
router.post('/api/addNewOrder', orderController.addNewOrder);
router.post('/api/getOrderInfo', orderController.getOrderInfo);
router.post('/api/cancelOrder', orderController.cancelOrder);
router.post('/api/paymentOrder', orderController.paymentOrder);
router.post('/api/updateOrder', orderController.updateOrder);
router.post('/api/addMenuToOrder', orderController.addMenuToOrder);
router.post('/api/getUnserveItem', orderController.getUnserveItem);
router.post('/api/getKitchenInfo', orderController.getKitchenInfo);
router.post('/api/updateItem', orderController.updateItem);
router.post('/api/deleteItem', orderController.deleteItem);
router.post('/api/changeTable', orderController.changeTable);
router.post('/api/splitOrder', orderController.splitOrder);
router.post('/api/getHistoryInfo', orderController.getHistoryInfo);
router.post('/api/getOrderHistory', orderController.getOrderHistory);
router.post('/api/deleteOrder', orderController.deleteOrder);
router.post('/api/getBarChartData', orderController.getBarChartData);
router.post('/api/getLineChartData', orderController.getLineChartData);
router.post('/api/getProcessingItem', orderController.getProcessingItem);


module.exports = router;
