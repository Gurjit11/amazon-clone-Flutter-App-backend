const express = require('express')
const adminRouter = express.Router()
const admin = require('../middlewares/admin')
const {Product} = require('../models/product')
const Order = require('../models/order')    

adminRouter.post('/admin/add-product',admin, async (req, res) => {
    try{
        const {name,description,images, quantity,price,category} = req.body

        let product = new Product({name,description,images, quantity,price,category});

        product = await product.save()
        res.json(product)
    } catch(err){
        res.status(500).json({error: err.message})
    }
})

adminRouter.get('/admin/get-products', admin , async (req, res) => {
    try{
        const products = await Product.find({});
        res.json(products)
    }catch (err){
        res.status(500).json({error: err.message})
    }
})

adminRouter.post('/admin/delete-product', admin , async (req, res) => {
    try {
        const {id} = req.body;
        // console.log(id)
        let product = await Product.findByIdAndDelete(id);
        
        res.json(product);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

adminRouter.get('/admin/get-orders', admin , async (req, res) => {
    try{
        const orders = await Order.find({});
        res.json(orders)
    }catch (err){
        res.status(500).json({error: err.message})
    }
})

adminRouter.post('/admin/change-order-status', admin , async (req, res) => {
    try {
        const {id , status} = req.body;
        // console.log(id)
        let order = await Order.findById(id);
        order.status = status
        order = await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

async function fecthCategoryWiseProduct(category) {
    let earningsCategory = 0;
    let categoryOrders = await Order.find({ 
        'products.product.category' : category,
    });

    for(let i = 0; i < categoryOrders.length; i++) {
        for(let i = 0; i < categoryOrders.length; i++) {
            earningsCategory += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.price
        }
    }
    return earningsCategory
}

adminRouter.get('/admin/analytics', async (req, res) => {
    try {
        const orders = await Order.find({})
        let totalEarnings = 0;
        for(let i = 0; i < orders.length; i++) {
            totalEarnings += orders[i].totalPrice;
        }

        let mobileEarnings = await fecthCategoryWiseProduct('Mobiles')
        let essentialEarnings = await fecthCategoryWiseProduct('Essentials')
        let applianceEarnings = await fecthCategoryWiseProduct('Appliances')
        let booksEarnings = await fecthCategoryWiseProduct('Books')
        let fashionEarnings = await fecthCategoryWiseProduct('Fashion')

        let earnings ={
            totalEarnings,
            mobileEarnings,
            essentialEarnings,
            applianceEarnings,
            booksEarnings,
            fashionEarnings,
        }

        res.json(earnings)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})


module.exports = adminRouter