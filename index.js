require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const TodoModel = require('./models/todoList.model.js')
const authRoutes = require('./routes/auth')
const authenticateToken = require('./middleware/authenticateToken.js')

const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL || null
const PORT = process.env.PORT || 5173

var app = express()
app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
 
mongoose.connect(DB_CONNECTION_URL)
// console.log(DB_CONNECTION_URL)

mongoose.connection.on("error", error => {
    // console.log(`MongoDB connection error: `, error)
})

app.post('/addTodoList', authenticateToken, (req, res) => {
    TodoModel.create({
        userId: req.user.id,
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline
    })
        .then(todo => {
            return res.json(todo)
        })
        .catch(err => {
            return res.json(err)
        })
})

app.post('/updateTodoList/:id', authenticateToken, (req, res) => {
    const id = req.params.id
    const updatedData = {
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline
    }
    const userId = req.user.id

    TodoModel.findById(id)
        .then(todo => {
            if(!todo)  
                return res.status(404).json({error: 'Todo not found'})
            if(todo.userId.toString() !== userId) return res.status(403).json({ error: 'Unauthorized' })

            TodoModel.findByIdAndUpdate(id, updatedData)
                .then(updatedTodo => {
                    return res.json(updatedTodo)
                })
                .catch(err => {
                    return res.status(400).json({ error: err.message })
                })
        })
        .catch(err => {
            return res.status(500).json({error: err.message})
        })
})

app.delete('/deleteTodoList/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
    const userId = req.user.id; 

    TodoModel.findById(id)
        .then(todo => {
            if (!todo) return res.status(404).json({ error: 'Todo not found' })
            if (todo.userId.toString() !== userId) return res.status(403).json({ error: 'Unauthorized' })

            TodoModel.findByIdAndDelete(id)
                .then(() => {
                    return res.json({ message: 'Todo deleted successfully' })
                })
                .catch(err => {
                    return res.status(400).json({ error: err.message })
                })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})


