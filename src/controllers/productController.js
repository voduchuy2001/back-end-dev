import Product from "../models/product";
const cloudinary = require('cloudinary').v2;

const createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brand,
            quantity: req.body.quantity,
            color: req.body.color,
        })
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
        const product = await Product.findOneAndUpdate({ id: id }, {
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brand,
            quantity: req.body.quantity,
            color: req.body.color,
        }, { new: true })
        if (!product) {
            return res.status(400).json({
                msg: "Not found!"
            })
        } else {
            return res.status(200).json({
                msg: "Updated",
                product: product,
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

const getAllProducts = async (req, res) => {
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

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({_id: req.params.id})

        if (!product) {
            return res.status(400).json({
                msg: "Not found!"
            })
        } else {
            const images = product.images
            for (const image of images) {
                await cloudinary.uploader.destroy(image.publicId)
            }
            await product.deleteOne({_id: req.params.id});
            return res.status(200).json({
                msg: 'Deleted!'
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
        const product = await Product.findOne({ _id: id })
        if (!product) {
            return res.status(400).json({
                msg: "Not found product!"
            })
        } else {
            const files = req.files
            const images = [];
            for (const file of files) {
                images.push({
                    publicId: file.filename,
                    url: file.path
                })
            }

            product.images.push(...images);
            await product.save();

            return res.status(200).json({
                msg: "Upload success!",
                product: product
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg: '500 Server ' + error
        })
    }
}

const deleteImg = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).json({
                msg: 'Product not found'
            });
        } else {
            const image = product.images.find(image => image.publicId === req.params.imageId);
            if (!image) {
                return res.status(404).json({
                    msg: 'Image not found!'
                });
            } else {
                await cloudinary.uploader.destroy(req.params.imageId);
                product.images = product.images.filter(image => image.publicId !== req.params.imageId);
                await product.save();

                return res.status(200).json({
                    msg: "Delete success!",
                    product: product
                })
            }
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
    getAllProducts,
    uploadImg,
    deleteImg,
    deleteProduct,
}