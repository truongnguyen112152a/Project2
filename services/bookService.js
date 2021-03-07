const bookModel = require('../models/bookModel')

function getBookAll() {
    return bookModel.find()
}
function getBookID(id) {
    return bookModel.find({
        _id: id
    })
}
function getEmail(email) {
    return bookModel.find({
        email: email
    })
}
function createBook(obj) {
    return bookModel.create(obj)
}
function updateBook(id, obj) {
    return bookModel.updateOne({
        _id: id
    },obj)
}
function deleteBook(id) {
    return bookModel.deleteOne({
        _id: id
    })
}

module.exports = {
    getBookAll,
    getBookID,
    createBook,
    updateBook,
    deleteBook,
    getEmail
}
