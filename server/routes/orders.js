const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

// Rate limiter: maximum 5 orders per hour per IP
const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many orders created from this IP, please try again after an hour'
});

// Joi validation schema
const orderSchema = Joi.object({
    customerName: Joi.string().min(2).max(50).required(),

    phone: Joi.string().pattern(/^[0-9+\s-]{8,20}$/).required(),
    address: Joi.string().min(5).max(200).required(),
    items: Joi.array().items(
        Joi.object({
            product: Joi.string().required(), // Product ID
            quantity: Joi.number().integer().min(1).default(1)
        })
    ).min(1).required(),
    totalAmount: Joi.number().min(0).required()
});

// POST /api/orders - Create a new order
router.post('/', orderLimiter, async (req, res) => {
    try {
        // Validate request body
        const { error, value } = orderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newOrder = new Order(value);
        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Server error while creating order' });
    }
});

module.exports = router;
