const userService = require('../services/userService');


let handleLogin = async (req, res) => {

    let phone = req.body.phone
    let password = req.body.password
    let userData = await userService.handleUserLogin(phone, password);

    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.data ? userData.data : {}
    })
}


let handleSignup = async (req, res) => {

    let userData = await userService.handleSignup(req.body);

    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.data ? userData.data : {}
    })
}

let getAllStaff = async (req, res) => {

    let Staffs = await userService.getAllStaffs(req.body.id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK!',
        staffs: Staffs ? Staffs : {},
    })
}

let updateUserByAdmin = async (req, res) => {

    let userData = await userService.updateUserByAdmin(req.body);
    let Staffs = await userService.getAllStaffs(req.body.restaurantID);
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        staffs: Staffs ? Staffs : {},

    })
}

let deleteUser = async (req, res) => {

    let userData = await userService.deleteUser(req.body);
    let Staffs = await userService.getAllStaffs(req.body.resID);

    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        staffs: Staffs ? Staffs : {},
    })
}

let addNewUser = async (req, res) => {
    let user = req.body;
    let userData = await userService.addNewUser(user);
    let Staffs = await userService.getAllStaffs(user.restaurantID);

    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        staffs: Staffs ? Staffs : {},
    })
}

let getResInfo = async (req, res) => {
    let id = req.body.id;
    let result = await userService.getResInfo(id)
    return res.status(200).json({
        errCode: result.errCode,
        errMessage: result.errMessage,
        resData: result.resData,
    })

}

let changePass = async (req, res) => {

    let userData = await userService.changePass(req.body);

    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
    })
}

let updateRes = async (req, res) => {

    let result = await userService.updateRes(req.body)
    return res.status(200).json({
        errCode: result.errCode,
        errMessage: result.errMessage,
        resData: result.resData,
    })

}

let updateProfile = async (req, res) => {

    let userData = await userService.updateProfile(req.body);
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.data ? userData.data : {},

    })
}

module.exports = {
    handleLogin, getAllStaff, updateProfile,
    updateUserByAdmin, deleteUser, changePass, addNewUser,
    getResInfo, handleSignup, updateRes
};