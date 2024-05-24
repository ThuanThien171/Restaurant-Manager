const db = require('../models/index');
const { QueryTypes } = require('sequelize');
const sequelize = require('sequelize');
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


let hashPassword = (pw) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hash = await bcrypt.hashSync(pw, salt);

            resolve(hash);
        } catch (e) {
            reject(e);
        }
    })
}

let handleUserLogin = (phone, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            if (!phone || !password) {
                userData.errCode = 3;
                userData.errMessage = 'Thiếu sdt hoặc mật khẩu!';
            } else {
                let user = await db.User.findOne({
                    where: { phone: phone },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                    raw: true
                })
                if (user) {
                    if (bcrypt.compareSync(password, user.password)) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK!';
                        // console.log(user);
                        delete user.password;
                        userData.data = user;
                    } else {
                        userData.errCode = 1;
                        userData.errMessage = 'Sai mật khẩu!';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'Tài khoản không tồn tại!';
                }
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let handleSignup = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let hash = await hashPassword(data.password);
            let user = await db.User.findOne({
                where: { phone: data.phone }
            })
            let resInfo = await db.sequelize.query('SELECT * FROM Restaurants WHERE restaurantName = :name ',
                {
                    replacements: { name: data.restaurantName },
                    type: QueryTypes.SELECT
                })
            if (user) {
                userData.errCode = 1;
                userData.errMessage = "Số điện thoại đã tồn tại!"
            } else if (resInfo[0] != undefined) {
                userData.errCode = 2;
                userData.errMessage = "Nhà hàng đã tồn tại!"
            } else {

                let newRes = await db.Restaurant.create({
                    restaurantName: data.restaurantName,
                    address: data.address,
                    description: data.description,
                })

                let newUser = await db.User.create({
                    restaurantID: newRes.id,
                    userName: data.userName,
                    phone: data.phone,
                    password: hash,
                    role: data.role,
                });
                delete newUser.password;
                delete newUser.createdAt;
                delete newUser.updatedAt;

                userData.data = newUser;
                userData.errCode = 0;
                userData.errMessage = "OK!"
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllStaffs = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let staffs = await db.User.findAll({
                where: {
                    restaurantID: id,
                    role: {
                        [Op.ne]: 3,
                    }
                },
                attributes: {
                    exclude: ["password", "createdAt", "updatedAt"],
                },
                order: [
                    ['role', 'DESC'],
                ],
                raw: true
            })
            resolve(staffs);
        } catch (e) {
            reject(e);
        }
    })
}
//

let deleteUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let admin = await db.User.findOne({
                where: { id: data.id }
            })

            if (admin) {
                if (bcrypt.compareSync(data.password, admin.password)) {
                    let user = await db.User.findOne({
                        where: { id: data.deleteUserID }
                    })
                    if (user) {
                        await user.destroy();
                        result.errCode = 0;
                        result.errMessage = "OK!";
                    } else {

                        result.errCode = 2;
                        result.errMessage = "Không tồn tại nhân viên này!";
                    }

                } else {

                    result.errCode = 1;
                    result.errMessage = "Sai mật khẩu!";
                }

            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })

}

let updateUserByAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let hash = "";

            if (data.password) {
                hash = await hashPassword(data.password);
            }

            let user = await db.User.findOne({
                where: { id: data.id }
            })

            let sameNameInRes = await db.User.findOne({
                where: {
                    restaurantID: data.restaurantID,
                    userName: data.userName,
                    id: {
                        [Op.ne]: data.id,
                    }
                }
            });

            let samePhone = await db.User.findOne({
                where: {
                    phone: data.phone,
                    id: {
                        [Op.ne]: data.id,
                    }
                }
            });

            if (user) {
                if (sameNameInRes) {
                    result.errCode = 1;
                    result.errMessage = "Tên nhân viên đã tồn tại!";
                } else if (samePhone) {
                    result.errCode = 2;
                    result.errMessage = "Số điện thoại đã được dùng!";
                } else {

                    user.userName = data.userName;
                    user.phone = data.phone;
                    if (hash != "") { user.password = hash; }
                    user.role = data.role;

                    await user.save();
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

let addNewUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let hash = await hashPassword(user.password);
            let isPhoneExist = await db.User.findOne({
                where: { phone: user.phone }
            });
            let sameNameInRes = await db.User.findOne({
                where: {
                    restaurantID: user.restaurantID,
                    userName: user.userName
                }
            });

            if (isPhoneExist) {
                result.errCode = 2;
                result.errMessage = "Số điện thoại này đã được dùng!";
            } else if (sameNameInRes) {
                result.errCode = 3;
                result.errMessage = "Tên nhân viên đã tồn tại!";
            } else {
                await db.User.create({
                    restaurantID: user.restaurantID,
                    phone: user.phone,
                    userName: user.userName,
                    password: hash,
                    role: user.role
                });
                result.errCode = 0;
                result.errMessage = "Thêm nhân viên thành công!";
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let getResInfo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resData = await db.Restaurant.findOne({
                where: { id: id },
                raw: true
            })
            let result = {
                errCode: 0,
                errMessage: "OK!",
                resData: resData
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let changePass = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let user = await db.User.findOne({
                where: { id: data.userId }
            })
            // let resInfo = await db.sequelize.query('SELECT * FROM restaurants WHERE restaurantName = :name AND restaurantName REGEXP BINARY :name',
            //     {
            //         replacements: { name: data.restaurantName },
            //         type: QueryTypes.SELECT
            //     })
            if (user) {

                if (bcrypt.compareSync(data.password, user.password)) {
                    user.password = await hashPassword(data.newPassword);;
                    await user.save();
                    result.errCode = 0;
                    result.errMessage = "OK!";
                } else {
                    result.errCode = 1;
                    result.errMessage = "Sai mật khẩu!";
                }

            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })

}

let updateRes = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            let sameNameRes = await db.Restaurant.findOne({
                where: {
                    restaurantName: data.newName,
                    id: { [Op.ne]: data.id }
                },
                //raw: true
            })
            if (sameNameRes) {
                result.errCode = 2;
                result.errMessage = "Nhà hàng đã tồn tại!";
            } else {
                let resData = await db.Restaurant.findOne({
                    where: { id: data.id },
                    //raw: true
                })
                if (resData) {

                    resData.restaurantName = data.newName;
                    resData.address = data.address ? data.address : "";
                    resData.description = data.description ? data.description : "";

                    await resData.save();

                    result.errCode = 0;
                    result.errMessage = "OK!";
                } else {
                    result.errCode = 1;
                    result.errMessage = "Nhà hàng không tồn tại!";
                }
            }
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

let updateProfile = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};

            let user = await db.User.findOne({
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt'],
                },
                where: { id: data.id }
            })

            let sameNameInRes = await db.User.findOne({
                where: {
                    restaurantID: data.resID,
                    userName: data.userName,
                    id: {
                        [Op.ne]: data.id,
                    }
                }
            });

            let samePhone = await db.User.findOne({
                where: {
                    phone: data.phone,
                    id: {
                        [Op.ne]: data.id,
                    }
                }
            });

            if (user) {
                if (sameNameInRes) {
                    result.errCode = 1;
                    result.errMessage = "Tên đã tồn tại!";
                } else if (samePhone) {
                    result.errCode = 2;
                    result.errMessage = "Số điện thoại đã được dùng!";
                } else {

                    user.userName = data.userName;
                    user.phone = data.phone;

                    await user.save();
                    result.data = user;
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

module.exports = {
    handleUserLogin, getAllStaffs,
    updateUserByAdmin, deleteUser,
    changePass, addNewUser, getResInfo,
    handleSignup, updateRes, updateProfile
};