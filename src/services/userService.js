import db from "../models/index";
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: {email : email},  
                    raw: true
                });
                if (user) {
                    //compare password
                    let check =  await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 1;
                        userData.errMessage = "OK nha";
                        
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 0;
                        userData.errMessage = 'Sai mat khau nha';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "Tai khoan cua ban khong ton tai. Vui long nhap lai!";
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = "Email cua ban khong ton tai. Vui long nhap lai!";
            }
            resolve(userData);
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email : userEmail}
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch(error) {
            reject(error);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = 'abc';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } 
            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {id : userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt); 
            // let hashPassWord = await bcrypt.hashSync("B4c0/\/", salt);
            resolve(hashPassword); 
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Email cua may da duoc su dung, nhap email khac di'
                })
            }
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve({
                errCode: 0,
                message: "Oke hehe"
            })
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        let user = await db.User.findOne({
            where : {id :userId}
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `Tai khoan khong ton tai`
            })
        }
        await db.User.destroy({
            where: { id : userId}
        });
        resolve({
            errCode: 0,
            errMessage: `Tai khoan da duoc xoa nha`
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
                let user = await db.User.findOne({
                    where: {id: data.id},
                    raw : false
                })
                if (user) {
                        user.firstName = data.firstName;
                        user.lastName = data.firstName;
                        user.address = data.address;

                    await db.User.save();
                    
                    resolve({
                        errCode: 0,
                        message: "Da update thanh cong"
                    });
                } else {
                    resolve({
                        errCode: 1,
                        message: "Khong tim thay user"
                    });
                }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleUserLogin : handleUserLogin,
    getAllUsers : getAllUsers,
    createNewUser : createNewUser,
    deleteUser : deleteUser,
    updateUserData : updateUserData
}