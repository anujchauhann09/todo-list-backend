const express = require('express')
const router = express.Router()
const User = require('../models/user.model.js')
const { generateToken } = require('../utilities/jwt')
const authenticateToken = require('../middleware/authenticateToken.js')
const TodoModel = require('../models/todoList.model.js');

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body
        const user = new User({email, password, name})
        await user.save()
        const token = generateToken(user)
        return res.status(201).json({token, name})
        // console.log(name)
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})

        if(!user || !(await user.comparePassword(password)))
            return res.status(401).json({error: 'Invalid credentials'})

        const token = generateToken(user)
        // console.log(user.name)
        return res.status(200).json({token, name: user.name })
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
})

router.get('/getTodoList', authenticateToken, (req, res) => {
    TodoModel.find({ userId: req.user.id })
      .then(todoList => {
        return res.status(200).json(todoList)
      })
      .catch(err => {
        return res.status(400).json({error: err.message})
      });
});

module.exports = router