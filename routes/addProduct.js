const {Router} = require('express')

const Product = require('../models/product')

const router = Router()

router.get('/', (req, res) => {
    res.render('add-product.hbs', {
        title: 'Add Product',
        isAddProduct: true
    })
})

router.post('/', async (req, res) => {
    const {title, price, imgURL} = req.body
    const userId = req.user._id
    const product = new Product({title, price, imgURL, userId})

    try {
        await product.save()
        res.redirect('/products')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router


