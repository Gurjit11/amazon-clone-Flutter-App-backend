const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs'); 
const authRouter = express.Router()
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

authRouter.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token})
})

authRouter.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body

        const exists = await User.findOne({ email })
        if (exists) {
            return res.status(400).json({ msg: "You already have an account" })
        }

        const hashedpassword = await bcryptjs.hash(password, 8)

        let user = new User({
            email, password:hashedpassword, name,
        })
        user = await user.save()
        res.json({ user: user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }

})

authRouter.post('/api/signin', async (req, res) => {
    try{
        const {email,password} = req.body

        const user = await User.findOne({ email: email})
        if(!user){
            return res.status(400).json({msg: 'User not found'});
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: 'Password Incorrect'});
        }

        const token = await jwt.sign({id: user._id}, 'passwordKey')
        res.json({token: token, ...user._doc});
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

authRouter.post('/tokenIsValid', async (req, res) => {
    try{
        const token = req.header('x-auth-token');
        if(!token) return res.json(false)
        const verified = jwt.verify(token , 'passwordKey')
        if(!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if(!user) return res.json(false)
        res.json(true)
        
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})



module.exports = authRouter