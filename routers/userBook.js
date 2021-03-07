const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const book = require('../services/bookService')
const user = require('../services/userService')

// tạo một book mới theo mã token
// ok
router.post("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "user") return next()
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
}, (req, res, next) => {
    try {
        var email = req.body.email
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
                message: "lỗi xác minh email :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 2 :" + error
        })
    }
}, (req, res) => {
    try {
        var email = req.body.email
        var name = req.body.name
        var time = req.body.time
        var obj = {
            email,
            name,
            time
        }
        book.createBook(obj)
        .then((data) => {
            return res.json({
                error: false,
                message: "tạo book thành công"
            })
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi tạo book không thành công là :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input :" + error
        })
    }
})

// xem thông tin book theo token quyền user
// ok
router.get("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "user") return next()
            return res.json({
                error: false,
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
}, (req, res) => {
    try {
        var email = req.body.email
        book.getEmail(email)
        .then((data) => {
            return res.json({
                error: false,
                message: "Tất cả book",
                value: data
            })
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi tìm kiếm 2 :" + err
            })
        });
    } catch (error) {
        return res.json({
            err: true,
            message: "lỗi input 2 :" + error,
        })
    }
})

// thay đổi thông tin book quyền user
// ok
router.put("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "user") return next()
            return res.json({
                error: false,
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
}, (req, res, next) => {
    try {
        var email = req.body.email
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
                message: "lỗi xác minh email :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 2 :" + error
        })
    }
}, (req, res) => {
    try {
        var id = req.body.id
        var name = req.body.name
        var time = req.body.time
        var obj = {
            name,
            time
        }
        book.updateBook(id, obj)
        .then((data) => {
            return res.json({
                error: false,
                message: "thay đổi book thành công"
            })
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi thay đổi book không thành công là :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 3:" + error
        })
    }
})

// xóa book quyền user
// ok
router.delete("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "user") return next()
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
}, (req, res) => {
    try {
        var id = req.body.id
        book.deleteBook(id)
        .then((data) => {
            return res.json({
                error: false,
                message: "xóa book thành công"
            })
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi xóa book không thành công là :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input :" + error
        })
    }
})

module.exports = router