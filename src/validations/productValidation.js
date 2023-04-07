import { body } from "express-validator";

const validateCreateProduct = () => [
    body('name').notEmpty().withMessage('Name is required!'),
    body('slug').notEmpty().withMessage('Slug is required!'),
    body('description').notEmpty().withMessage('Description is required!'),
    body('price').notEmpty().withMessage('Price is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('brand').notEmpty().withMessage('Brand is required!'),
    body('quantity').notEmpty().withMessage('Quantity is required'),
    body('color').notEmpty().withMessage('Color is required')
]

const validateUpdateProduct = () => [
    body('name').notEmpty().withMessage('Name is required!'),
    body('slug').notEmpty().withMessage('Slug is required!'),
    body('description').notEmpty().withMessage('Description is required!'),
    body('price').notEmpty().withMessage('Price is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('brand').notEmpty().withMessage('Brand is required!'),
    body('quantity').notEmpty().withMessage('Quantity is required'),
    body('color').notEmpty().withMessage('Color is required')
]

module.exports = {
    validateCreateProduct,
    validateUpdateProduct,
}