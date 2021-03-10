const user = require('../services/userService')
const book = require('../services/bookService')
const jwt = require('jsonwebtoken');

function checkAuthor(req, res, next) {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "user") {
                req.author = 0
                req.id = decode._id
                req.email = data[0].email
                return next()
            } 
            if(data[0].roles === "admin") {
                req.author = 1
                req.id = decode._id
                return next()
            }  
            return res.json({
                error: true,
                message: "Bạn chưa đăng nhập"
            })
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi tìm kiếm 1 :" + err
            })
        });
    } catch (error) {
        if(error.message === "jwt must be provided"){
            return res.json({
                error: true,
                message: "Bạn phải cung cấp mã token"
            })
        }
        if(error.message === "invalid signature"){
            return res.json({
                error: true,
                message: "Mã token không đúng"
            })
        }
        return res.json({
            err: true,
            message: "lỗi input 1 :" + error,
        })
    }
}

function checkEmail(req, res, next) {
    try {
        var email = req.body.email
        user.getUserAll()
        .then((data) => {
            for(let i = 0; i < data.length; i++) {
                if(email === data[i].email) return res.json({
                    error: true,
                    message: "email này đã tồn tại"
                })
            }
            return next()
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi xác minh email :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 2 :" + error
        })
    }
}

function checkBook(req, res, next) {
    try {
        var email = req.email || req.body.email
        var name = req.body.name
        book.getEmail(email)
        .then((data) => {
            for(let i = 0; i < data.length; i++) {
                if(data[i].name === name) return res.json({
                    error: true,
                    message: "Tên sách đã tồn tại"
                })
            }
            return next()
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi xác minh book :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 2 :" + error
        })
    }
}

module.exports = {
    checkAuthor,
    checkEmail,
    checkBook
}