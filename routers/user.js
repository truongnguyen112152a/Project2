const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const user = require('../services/userService')

// đăng ký quyền user(admin có thể tạo data thông qua api này)
// ok
router.post("/sign-up",(req, res, next) => {
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
            message: "lỗi input 1 :" + error
        })
    }
}, (req, res) => {
    try {
        var email = req.body.email
        var username = req.body.username
        var phone = req.body.phone
        var password = req.body.password
        bcrypt.hash(password, saltRounds, function(err, hash) {
            var obj = { email, username, phone, password: hash}
            user.createUser(obj)
            .then((data) => {
                return res.json({
                    error: false,
                    message: "tạo tài khoản thành công",
                    value: data
                })
            }).catch((err) => {
                return res.json({
                    error: true,
                    message: "lỗi tạo tài khoản thất bại :" + err
                })
            });
        })
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 2 :" + error
        })
    }
})
// đăng nhập quyền user,admin
// ok
router.post("/login",(req, res, next) => {
    try {
        var email = req.body.email
        var password = req.body.password
        user.getEmail(email)
        .then((data) => {
            if(!data.length) {
                return res.json({
                    error: true,
                    message: "Đăng nhập thất bại"
                })
            }
            if(data[0].roles === "user") {
                bcrypt.compare(password, data[0].password).then((result) => {
                    if(result) {
                        var token = jwt.sign({ _id: data[0]._id }, "project2", {expiresIn: "1d"}); 
                        return res.json({
                            error: false,
                            message: "Đăng nhập thành công",
                            value: 0,
                            token: token
                        })
                    }
                }) 
            }
            return next()  
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi đăng nhập 1 :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 1 :" + error
        })
    }
}, (req, res) => {
    try {
        var email = req.body.email
        var password = req.body.password
        user.getEmail(email)
        .then((data) => {
            if(!data.length) {
                return res.json({
                    error: true,
                    message: "Đăng nhập thất bại"
                })
            }
            if(data[0].roles === "admin") {
                bcrypt.compare(password, data[0].password).then((result) => {
                    if(result) {
                        var token = jwt.sign({ _id: data[0]._id }, "project2", {expiresIn: "1d"}); 
                        return res.json({
                            error: false,
                            message: "Đăng nhập thành công",
                            value: 1,
                            token: token
                        })
                    }
                })    
            }
        }).catch((err) => {
            return res.json({
                error: true,
                message: "lỗi đăng nhập 2 :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 2 :" + error
        })
    }
})

// user xem thông tin chi tiết khi đăng nhập bằng mã token
// ok
router.get("/:token", (req, res) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserId(decode._id)
        .then((data) => {
            if(data[0].roles === "user") {
                return res.json({
                    error: false,
                    message: "Tất cả data",
                    value: data
                })
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
})

// thay đổi thông tin theo token quyền user
// ok
router.put("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        var id = decode._id
        user.getUserId(id)
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
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        var id = decode._id
        var email = req.body.email
        var username = req.body.username
        var phone = req.body.phone
        var password = req.body.password
        bcrypt.hash(password, saltRounds, function(err, hash) {
            var obj = { email, username, phone, password: hash}
            user.updateUser(id,obj)
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
// xóa thông tin theo token quyền user
// ok
router.delete("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        var id = decode._id
        user.getUserId(id)
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
}, (req,res) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        var id = decode._id
        user.deleteUser(id)
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