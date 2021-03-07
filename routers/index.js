const express = require('express')
const router = express.Router()
const path = require('path')

const admin = require('./admin')
const adminBook = require('./adminBook')
const user = require('./user')
const userBook = require('./userBook')

router.use('/admin', admin)
router.use('/adminBook', adminBook)
router.use('/user', user)
router.use('/userBook', userBook)

router.get('/sign-up',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/signUp.html"))
})
router.get('/login',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/login.html"))
})
router.get('/home-admin',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/admin.html"))
})
router.get('/detail/:id',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/detail.html"))
})
module.exports = router

