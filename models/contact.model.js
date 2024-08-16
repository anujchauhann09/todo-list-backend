const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required:true
    },
    submissionDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Contact = mongoose.model("Contact", contactSchema)

module.exports = Contact