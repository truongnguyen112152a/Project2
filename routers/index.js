const express = require('express')
const router = express.Router()
const path = require('path')

const admin = require('./admin')
const user = require('./user')

router.use('/admin', admin)
router.use('/user', user)

router.get('/sign-up',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/signUp.html"))
})
router.get('/login',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/login.html"))
})
router.get('/admin',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/admin.html"))
})
router.get('/detail/:id',(req,res) => {
    res.sendFile(path.join(__dirname,"../views/detail.html"))
})
module.exports = router

