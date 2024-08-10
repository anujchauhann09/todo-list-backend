require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const helmet = require('helmet')
const TodoModel = require('./models/todoList.model.js')
const User = require('./models/user.model.js')
const authRoutes = require('./routes/auth')
const authenticateToken = require('./middleware/authenticateToken.js')

const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL
const PORT = process.env.PORT

var app = express()
app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use(helmet()) // helmet to set various HTTP headers for security

// Customize specific headers
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
  },
}))

app.use(helmet.hsts({
  maxAge: 31536000, // 1 year in seconds
  includeSubDomains: true,
}))
 
mongoose.connect(DB_CONNECTION_URL)
// console.log(DB_CONNECTION_URL)

mongoose.connection.on("error", error => {
    console.log(`MongoDB connection error: `, error)
})

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully.");
});

const testConnection = async () => {
    try {
      const todoResult = await TodoModel.findOne({})
      console.log('Todo list query result:', todoResult)
  
      const userResult = await User.findOne({})
      console.log('User query result:', userResult)
      
  } catch (error) {
        console.error('Error during test query:', error)
  }
}
  
mongoose.connection.once('open', () => {
  testConnection()
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


