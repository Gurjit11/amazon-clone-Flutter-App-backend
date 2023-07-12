const mongoose = require('mongoose');
const { productSchema } = require('./product');

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate:{
            validator: (val) => {
                let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return val.match(regex)
            },
            message: 'Invalid Email'
        }
    },
    password: {
        required: true,
        type: String,
        validate:{
            validator: (val) => {
                return val.length > 5
            },
            message: 'Length must be at least 6 characters'
        }
    },
    address: {
        type: String,
        default:''
    },
    type: {
        type:String,
        default: "user"
    },
    cart:[
        {
            product:productSchema,
            quantity:{
                type:Number,
                required:true,
            },
        },
    ],
})

const User = mongoose.model("User",userSchema)
module.exports = User