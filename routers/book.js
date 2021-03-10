const express = require('express')
const router = express.Router()
const book = require('../services/bookService')
const author = require('../middleware/middleware')

// tạo một book mới theo mã token quyền user,admin
// ok
router.post("/:token", author.checkAuthor, author.checkBook, (req, res) => {
    try {
        var email = req.email
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
            message: "lỗi input 3 :" + error
        })
    }
})

// xem thông tin book quyền admin xem toàn bộ,user xem chỉ một
// ok
router.get("/:token", author.checkAuthor, (req, res) => {
    try {
        if(req.author) {
            return book.getBookAll()
            .then((data) => {
                res.json({
                    error: false,
                    message: "Tất cả book",
                    value: data
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: "lỗi tìm kiếm 1 :" + err
                })
            });
        }
        return book.getEmail(req.email)
        .then((data) => {
            if(data.length) {
                return res.json({
                    error: false,
                    message: "Tất cả book",
                    value: data
                })
            }
            return res.json({
                error: true,
                message: "Bạn chưa có book"
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

router.get("/detail/:email/:token", author.checkAuthor, (req, res) => {
    try {
        if(req.author) {
            return book.getEmail(req.params.email)
            .then((data) => {
                res.json({
                    error: false,
                    message: "Tất cả book",
                    value: data
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: "lỗi tìm kiếm 1 :" + err
                })
            });
        }
        return book.getEmail(req.email)
        .then((data) => {
            if(data.length) {
                return res.json({
                    error: false,
                    message: "Tất cả book",
                    value: data
                })
            }
            return res.json({
                error: true,
                message: "Bạn chưa có book"
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
// thay đổi thông tin book quyền admin,user
// ok
router.put("/:token", author.checkAuthor, author.checkBook, (req, res) => {
    try {
        var id = req.body.id
        var name = req.body.name
        var time = req.body.time
        var obj = {
            name,
            time
        }
        return book.updateBook(id, obj)
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

// xóa book quyền admin,user
// ok
router.delete("/:token", author.checkAuthor, (req, res) => {
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