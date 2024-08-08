const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        requied: true
    },
    name: {
        type: String,
        required: true 
    }
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) 
        return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
}) 

userSchema.methods.comparePassword = async function(userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User