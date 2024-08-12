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
    deadline: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
})

const TodoList = mongoose.model("TodoList", todoSchema)

module.exports = TodoList