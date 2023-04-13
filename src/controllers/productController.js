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
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";

        const products = await Product.find({
            name: { $regex: search, $options: "i" }
        })
            .skip(page * limit)
            .limit(limit)

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

const uploadImg = async (req, res) => {
    try {
        const id = req.params.id
        const files = req.files
        const product = await Product.findOne({ _id: id })
        if (!product) {
            return res.status(400).json({
                msg: "Not found product!"
            })
        } else {
            for (const file of files) {
                await Product.findByIdAndUpdate(
                    { _id: id },
                    { $push: { "images": { url: file.path, publicId: file.filename } } },
                    { new: true }
                )
            }

            return res.status(200).json({
                msg: "Upload success!"
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
    uploadImg,
}