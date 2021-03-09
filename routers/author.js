const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const user = require('../services/userService')
const author = require('../middleware/middleware')

// đăng ký quyền user(admin có thể tạo data thông qua api này)
// ok
router.post("/sign-up", author.checkEmail, (req, res) => {
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
router.post("/login",(req, res) => {
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
                    return res.json({
                        error: true,
                        message: "Đăng nhập thất bại"
                    })
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
                    return res.json({
                        error: true,
                        message: "Đăng nhập thất bại"
                    })
                })    
            }
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
})

// xem toàn bộ data quyền admin xem tất cả,user xem chỉ một
// ok
router.get("/:token", author.checkAuthor, (req, res, next) => {
    try {
        if(req.author) {
            return user.getUserAll(req.id)
            .then((data) => {
                res.json({
                    error: false,
                    message: "Tất cả data",
                    value: data
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: "lỗi tìm kiếm 2 :" + err
                })
            });  
        }
        return next()
    } catch (error) {
        return res.json({
            err: true,
            message: "lỗi input 2 :" + error,
        })
    }
}, (req, res) => {
    try {
        return user.getUserId(req.id)
        .then((data) => {
            res.json({
                error: false,
                message: "chi tiết data",
                value: data
            })
        }).catch((err) => {
            res.json({
                error: true,
                message: "lỗi tìm kiếm 3 :" + err
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
router.get("/page/:numPage/:token", author.checkAuthor, (req, res) => {
    try {
        if(req.author) {
            let x = Number(req.params.numPage)
            x = (x - 1) * 6
            return user.getUserAll(req.id)
            .skip(x)
            .limit(6)
            .then((data) => {
                res.json({
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
        }
        return null  
    } catch (error) {
        return res.json({
            err: true,
            message: "lỗi input 2 :" + error,
        })
    }
    
})

// xem chi tiết thông tin của một user quyền admin
// ok
router.get("/detail/:id/:token", author.checkAuthor, (req, res) => {
    try {
        if(req.author) {
            return user.getUserId(req.params.id)
            .then((data) => {
                res.json({
                    error: false,
                    message: "hiển thị dữ liệu thành công",
                    value: data
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: "lỗi hiển thị chi tiết :" + err
                })   
            });
        }
        return null
    } catch (error) {
        return res.json({
            error: true,
            message: "lỗi input 2 :" + error
        })
    }
})
// thay đổi thông tin theo id quyền admin,user
// ok
router.put("/:id/:token", author.checkAuthor, author.checkEmail, (req, res) => {
    try {
        var id = req.params.id
        var email = req.body.email
        var username = req.body.username
        var phone = req.body.phone
        var password = req.body.password
        if(req.author) {
            return bcrypt.hash(password, saltRounds, function(err, hash) {
                var obj = { email, username, phone, password: hash}
                user.updateUser(id, obj)
                .then((data) => {
                    res.json({
                        error: false,
                        message: "cập nhật dữ liệu thành công ok",
                        value: data
                    })
                }).catch((err) => {
                    res.json({
                        error: true,
                        message: "lỗi cập nhật :" + err
                    })   
                });
            })
        }
        return bcrypt.hash(password, saltRounds, function(err, hash) {
            var obj = { email, username, phone, password: hash}
            user.updateUser(req.id, obj)
            .then((data) => {
                res.json({
                    error: false,
                    message: "cập nhật dữ liệu thành công",
                    value: data
                })
            }).catch((err) => {
                res.json({
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
// xóa thông tin theo id quyền admin,user
// ok
router.delete("/:id/:token", author.checkAuthor, (req, res) => {
    try {
        if(req.author) {
            return user.deleteUser(req.params.id)
            .then((data) => {
                res.json({
                    error: false,
                    message: "xóa dữ liệu thành công ok",
                    value: 1
                })        
            }).catch((err) => {
                res.json({
                    error: true,
                    message: "lỗi xóa :" + err
                })         
            });
        }
        return user.deleteUser(req.id)
        .then((data) => {
            res.json({
                error: false,
                message: "xóa dữ liệu thành công",
                value: 1
            })        
        }).catch((err) => {
            res.json({
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