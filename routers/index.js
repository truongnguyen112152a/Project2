const express = require('express')
const router = express.Router()
const path = require('path')

const author = require('./author')
const book = require('./book')

router.use('/author', author)
router.use('/book', book)

router.get('/sign-up',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/signUp.html"))
})
router.get('/login',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/login.html"))
})
router.get('/admin',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/admin.html"))
})
router.get('/user',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/user.html"))
})
module.exports = router

