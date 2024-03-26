const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/CRUD').then(console.log('db connected'))
const app = express();

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }))

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
})

const Product = new mongoose.model('product', productSchema)



// create product api
app.post('/api/v1/product/new', async (req, res) => {

    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product

    })
})

//Read product api

app.get('/api/v1/product', async (req, res) => {

    const products = await Product.find()
    res.status(200).json({
        success: true,
        products
    })
})

//Update product api

app.put('/api/v1/product/:id', async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            useFindAndModify: false,
            runValidators: true
        })
        res.status(200).json({
            success: true,
            message: "product updated successfully",
            product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })

    }

})

//Delete product api

app.delete('/api/v1/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});



app.listen(4000, () => {
    console.log('server is running')
})