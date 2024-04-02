import bcrypt from 'bcryptjs'
import db from "../models/index";
import { raw } from 'body-parser';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async(data) => {
    return new Promise(async(resolve, reject) => {
        try {
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
            resolve('Create a new user succeed')
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

let getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw : true, 
            });
            resolve (users);
        } catch (error) {
            reject(error)
        }
    })
}


let getUserInfoById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw : true,
            })

            if (user) {
                resolve(user)
            }
            else {
                resolve({})
            }
        } catch (error) {
            reject(error)
        }
    })
}   

let updateUserData = (data) =>{
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: data.id}
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.firstName;
                user.address = data.address;

                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else {
                resolve();
            }
            await db.User.update({

            })
        } catch (error) {
            console.log(error)
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
           let user = await db.User.findOne({
                where: {id: userId}
           })
           if(user) {
            await user.destroy();
           } 
           resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createNewUser : createNewUser,
    getAllUser : getAllUser,
    getUserInfoById : getUserInfoById,
    updateUserData : updateUserData,
    deleteUserById : deleteUserById,
}