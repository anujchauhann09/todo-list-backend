const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    task: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    submissionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    deadline: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    isRemainderSend: {
        type: Boolean,
        default: false,
        required: true
    }
})

const TodoList = mongoose.model("TodoList", todoSchema)

module.exports = TodoList