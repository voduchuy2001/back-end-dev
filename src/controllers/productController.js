import Product from "../models/product";

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        if (!product) {
            return res.status(400).json({
                msg: "Fail to create!"
            })
        } else {
            return res.status(200).json({
                msg: "New product!",
                product: product,
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const id = req.params._id
        const product = await Product.findOne({ id: id })
        if (!product) {
            return res.status(400).json({
                msg: "Not found!"
            })
        } else {
            const updateProduct = await product.save(req.body)
            return res.status(200).json({
                msg: "Updated",
                product: updateProduct,
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const productDetail = async (req, res) => {
    try {
        const id = req.params._id
        const product = await Product.findOne({ id: id })

        if (!product) {
            return res.status(400).json({
                msg: "Not found!"
            })
        } else {
            return res.status(200).json({
                msg: "Product",
                product: product
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        
        if (products.length === 0) {
            return res.status(400).json({
                msg: "Not found!"
            })
        } else {
            return res.status(200).json({
                msg: "Product",
                product: products
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    productDetail,
    getAllProduct,
}