var db = require('../config/connection')
var ObjectId = require('mongodb').ObjectId;
const { format, formatISO, parseISO, startOfDay, compareAsc } = require('date-fns');
const { resolve } = require('express-hbs/lib/resolver');
module.exports = {
    addNewUser: (userDetails) => {
        return new Promise(async (resolve, reject) => {
            userDetails.name = userDetails.name.toUpperCase()
            await db.get().collection('Users').insertOne(userDetails).then((data) => {
                resolve({})
            })
        })
    },

    validateSignIn: (email,pass) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection('Users').find({email : email}).toArray()
            if(data[0]){
                if(data[0].password === pass){
                    resolve({status : 1, name: data[0].name})
                }
                else{
                    resolve({status : 2})
                }
            }
            else{
                resolve({status:3})
            }
        })
    },
}








