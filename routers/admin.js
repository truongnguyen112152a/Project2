const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const user = require('../services/userService')
const book = require('../services/bookService')

router.get("/:token", (req, res, next) => {
    try {
        var token = req.params.token || req.headers.authorization.split("Bearer ")[1]
        var decode = jwt.verify(token, "project2")
        user.getUserID(decode._id)
        .then((data) => {
            if(!data) {
                return res.json({
                    error: false,
                    messenger: "Không có tài khoản này"
                })
            }
            next()
        }).catch((err) => {
            return res.json({
                error: true,
                messenger: "lỗi tìm kiếm :" + err
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
            message: "lỗi input :" + error,
        })
    }
}, (req, res) => {
    try {
        user.getUserAll()
        .then((data) => {
            return res.json({
                error: false,
                messenger: "Tất cả data",
                value: data
            })
        }).catch((err) => {
            return res.json({
                error: true,
                messenger: "lỗi tìm kiếm :" + err
            })
        });
    } catch (error) {
        return res.json({
            err: true,
            message: "lỗi input :" + error,
        })
    }
})
router.get("/page/:numPage",(req,res) => {
    let x = Number(req.params.numPage)
    x = (x - 1) * 6
    user.getUserAll()
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
            messenge: err
        })   
    });
})
module.exports = router