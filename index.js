require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

const app = express()


//middleware
app.use(express.json())
app.use(authRouter)
app.use(adminRouter)
app.use(productRouter)
app.use(userRouter)


mongoose.connect(DB).then(() => {
    console.log('connected')
}).catch(err => console.log(err));


app.get('/api/',(req,res) => {
    res.json({status:"success"})
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`listening on port ${PORT}`);
})

