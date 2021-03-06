const userModel = require('../models/userModel')

function getUserAll() {
    return userModel.find()
}
function getUserID(id) {
    return userModel.find({
        _id: id
    })
}
function createUser(obj) {
    return userModel.create(obj)
}
function updateUser(id,obj) {
    return userModel.updateOne({
        _id: id
    },obj)
}
function deleteUser(id) {
    return userModel.deleteOne({
        _id: id
    })
}
function getEmail(email) {
    return userModel.find({
        email: email
    })
}
module.exports = {
    getUserAll,
    getUserID,
    createUser,
    updateUser,
    deleteUser,
    getEmail
}