const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const user = require('../services/userService')

// xem toàn bộ data quyền admin
// ok
router.get("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "admin") return next()
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
        user.getUserAll()
        .then((data) => {
            return res.json({
                error: false,
                message: "Tất cả data",
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

// xem data trên một page quyền admin
// ok
router.get("/page/:numPage/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "admin") return next()
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
        let x = Number(req.params.numPage)
        x = (x - 1) * 6
        user.getUserAll()
        .skip(x)
        .limit(6)
        .then((data) => {
            return res.json({
                error: false,
                messenge: "hiển thị chi tiết dữ liệu thành công",
                value: data
            })
        }).catch((err) => {
            res.json({
                error: true,
                messenge: "lỗi tìm kiếm 2 :" + err
            })   
        });    
    } catch (error) {
        return res.json({
            err: true,
            message: "lỗi input 2 :" + error,
        })
    }
    
})

// xem chi tiết thông tin của một user quyền admin
// ok
router.get("/detail/:id/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "admin") return next()
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
        user.getUserId(req.params.id)
        .then((data) => {
            return res.json({
                error: false,
                message: "hiển thị dữ liệu thành công",
                value: data
            })
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi hiển thị chi tiết :" + err
            })   
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 2 :" + error
        })
    }
})
// thay đổi thông tin theo id quyền admin
// ok
router.put("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "admin") return next()
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
        user.getEmail(email)
        .then((data) => {
            if(!data.length) return next()
            return res.json({
                error: true,
                message: "email này đã tồn tại"
            })
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
        var email = req.body.email
        var username = req.body.username
        var phone = req.body.phone
        var password = req.body.password
        bcrypt.hash(password, saltRounds, function(err, hash) {
            var obj = { email, username, phone, password: hash}
            user.updateUser(id, obj)
            .then((data) => {
                return res.json({
                    error: false,
                    message: "cập nhật dữ liệu thành công",
                    value: data
                })
            }).catch((err) => {
                return res.json({
                    error: true,
                    message: "lỗi cập nhật :" + err
                })   
            });
        })
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 3 :" + error
        })
    }
})
// xóa thông tin theo id quyền admin
// ok
router.delete("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "admin") return next()
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
        user.deleteUser(req.body.id)
        .then((data) => {
            return res.json({
                error: false,
                message: "xóa dữ liệu thành công",
                value: 1
            })        
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi xóa :" + err
            })         
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 2 :" + error
        })
    }
    
})
module.exports = router