const express = require('express')
const app = express()
var port = 5555
const router = require('./routers/index')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static( __dirname + "/publics"))
app.use('/', router)

app.listen(port,() => console.log(`server connect port ${port}`))