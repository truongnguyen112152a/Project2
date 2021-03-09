const userModel = require('../models/userModel')

function getUserAll(id) {
    return userModel.find({
        _id: { $ne : id}
    })
}
function getUserId(id) {
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
function getChangeEmail(email) {
    return userModel.find({
        email: { $ne : email}
    })
}
module.exports = {
    getUserAll,
    getUserId,
    createUser,
    updateUser,
    deleteUser,
    getEmail,
    getChangeEmail
}