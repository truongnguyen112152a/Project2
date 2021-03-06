const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const user = require('../services/userService')
const book = require('../services/bookService')

// đăng ký của user
router.post("/sign-up",(req, res, next) => {
    try {
        var email = req.body.email
        user.getEmail(email)
        .then((data) => {
            if(!data[0]) return next()
            return res.json({
                error: true,
                messenger: "email này đã tồn tại"
            })
        }).catch((err) => {
            res.json({
                error: true,
                messenger: "lỗi xác minh email là:" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            messenger: "lỗi input 1 :" + error
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
                    messenger: "tạo tài khoản thành công",
                    value: data
                })
            }).catch((err) => {
                return res.json({
                    error: true,
                    messenger: "lỗi tạo tài khoản thất bại là :" + err
                })
            });
        })
    } catch (error) {
        return res.json({
            error: true,
            messenger: "lỗi input 2 :" + error
        })
    }
})
router.post("/login",(req, res, next) => {
    try {
        var email = req.body.email
        var password = req.body.password
        user.getEmail(email)
        .then((data) => {
            if(!data) {
                return res.json({
                    error: true,
                    messenger: "Đăng nhập thất bại"
                })
            }
            if(data[0].roles === "user") {
                bcrypt.compare(password, data[0].password).then((result) => {
                    if(result) {
                        var token = jwt.sign({ _id: data._id }, "project2", {expiresIn: "1d"}); 
                        return res.json({
                            error: false,
                            messenger: "Đăng nhập thành công",
                            value: 0,
                            token: token
                        })
                    }
                }) 
            }
            next()  
        }).catch((err) => {
            res.json({
                error: true,
                messenger: "lỗi đăng nhập là :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            messenger: "lỗi input 1 :" + error
        })
    }
}, (req, res) => {
    try {
        var email = req.body.email
        var password = req.body.password
        user.getEmail(email)
        .then((data) => {
            if(!data) {
                return res.json({
                    error: true,
                    messenger: "Đăng nhập thất bại"
                })
            }
            if(data[0].roles === "admin") {
                bcrypt.compare(password, data[0].password).then((result) => {
                    if(result) {
                        var token = jwt.sign({ _id: data._id }, "project2", {expiresIn: "1d"}); 
                        return res.json({
                            error: false,
                            messenger: "Đăng nhập thành công",
                            value: 1,
                            token: token
                        })
                    }
                })    
            }
               
        }).catch((err) => {
            res.json({
                error: true,
                messenger: "lỗi đăng nhập là :" + err
            })
        });
    } catch (error) {
        return res.json({
            error: true,
            messenger: "lỗi input 2 :" + error
        })
    }
})
// router.get("/",(req,res) => {
//     user.getUserAll()
//     .then((data) => {
//         res.json({
//             error: false,
//             messenge: "hiển thị toàn bộ dữ liệu thành công",
//             value: data
//         })
//     }).catch((err) => {
//         res.json({
//             error: true,
//             messenge: err
//         })   
//     });
// })

router.get("/detail/:id",(req,res) => {
    try {
        user.getUserID(req.params.id)
        .then((data) => {
            res.json({
                error: false,
                messenger: "hiển thị dữ liệu thành công",
                value: data
            })
        }).catch((err) => {
            res.json({
                error: true,
                messenger: "lỗi hiển thị chi tiết :" + err
            })   
        });
    } catch (error) {
        res.json({
            error: true,
            messenger: "lỗi input :" + error
        })
    }
    
})
// router.post("/login",(req,res) => {
//     user.existsLogin(req.body.email,req.body.password)
//     .then((data) => {
//         if(data) {
//             return res.json({
//                 error: false,
//                 messenge: "tài khoản này đã tồn tại",
//                 value: data
//             })        
//         }
//         return res.json({
//             error: true,
//             messenge: "không tồn tại tài khoản này"
//         })
//     }).catch((err) => {
//         res.json({
//             error: true,
//             messenge: err
//         })          
//     });
// })
router.put("/:id",(req, res, next) => {
    try {
        var email = req.body.email
        user.getEmail(email)
        .then((data) => {
            if(!data[0]) return next()
            return res.json({
                error: true,
                messenger: "email này đã tồn tại"
            })
        }).catch((err) => {
            res.json({
                error: true,
                messenger: "lỗi xác minh email là:" + err
            })
        });
    } catch (error) {
        res.json({
            error: true,
            messenger: "lỗi input 1 :" + error
        })
    }
},(req, res) => {
    try {
        var email = req.body.email
        var username = req.body.username
        var phone = req.body.phone
        var password = req.body.password
        bcrypt.hash(password, saltRounds, function(err, hash) {
            var obj = { email, username, phone, password: hash}
            user.updateUser(req.params.id,obj)
            .then((data) => {
                res.json({
                    error: false,
                    messenger: "cập nhật dữ liệu thành công",
                    value: data
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    messenger: "lỗi cập nhật :" + err
                })   
            });
        })
    } catch (error) {
        res.json({
            error: true,
            messenger: "lỗi input 2 :" + error
        })
    }
})
router.delete("/:id",(req,res) => {
    try {
        user.deleteUser(req.params.id)
        .then((data) => {
            res.json({
                error: false,
                messenger: "xóa dữ liệu thành công"
            })        
        }).catch((err) => {
            res.json({
                error: true,
                messenger: "lỗi xóa :" + err
            })         
        });
    } catch (error) {
        res.json({
            error: true,
            messenger: "lỗi input :" + error
        })
    }
    
})
module.exports = router