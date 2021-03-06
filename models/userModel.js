const mongoose = require('../config/connectDB')
let userSchema = {
    email: String,
    username: String,
    phone: Number,
    password: String,
    roles: {
        default: "user",
        type: String
    }
}
let model = mongoose.model("user", userSchema)

module.exports = model