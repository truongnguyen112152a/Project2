const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/project2',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

module.exports = mongoose