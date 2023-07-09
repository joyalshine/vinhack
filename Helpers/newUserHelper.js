var db = require('../config/connection')
const bcrypt = require('bcrypt')

module.exports={
    addNewUser:(userDetails) => {
        return new Promise(async(resolve,reject) => {
            userDetails.password= await bcrypt.hash(userDetails.password,10)
            userDetails.facultyName=userDetails.facultyName.toUpperCase()
            db.get().collection('Users').insertOne(userDetails).then((data)=>{
                userDetails._id=data.insertedId
                resolve(userDetails)
            })
        })
        
    },
    uniqueUser:(userDetails) => {
        return new Promise(async(resolve,reject) => {
            userDetails.facultyName=userDetails.facultyName.toUpperCase()
            db.get().collection('Users').findOne({facultyId:userDetails.facultyId}).then((data)=>{
                resolve(data)
            })
        })
    },

    validateUser: (userCredentials) => {
        return new Promise(async(resolve,reject)=>{
            let data= await db.get().collection('Users').findOne({ facultyId: userCredentials.facultyId })
            let response={}
            if (data) {
                bcrypt.compare(userCredentials.password,data.password).then((status)=>{
                    if(status){
                        delete data.password
                        response.user=data
                        response.status=true
                        resolve(response)
                    }
                    else{
                        resolve({status:false})
                    }
                })
            } else {
                resolve({status:false})
            }
        })
    },

    passwordResetDataFetch:(id) => {
        return new Promise(async(resolve,reject) => {
            id = id.toUpperCase()
            db.get().collection('Users').findOne({facultyId:id}).then((data)=>{
                resolve(data)
            })
        })
    },

    passwordUpdate:(id, rawPass) => {
        return new Promise(async(resolve,reject) => {
            id = id.toUpperCase()
            let password= await bcrypt.hash(rawPass,10)
            db.get().collection('Users').updateOne({facultyId:id}, {
                $set: {
                    password: password
                }
            }).then((data)=>{
                resolve(data)
            })
        })
    },
}