const mongoose = require('../config/connectDB')
let userSchema = {
    email: String,
    name: String,
    time: String
}
let model = mongoose.model("book", userSchema)

module.exports = model