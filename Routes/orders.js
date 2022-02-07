const express = require('express');
const Order = require('../models/order')
const Product = require('../models/product')
const auth = require('../middleware/auth')

const router = express.Router();


router.get('/', auth, (req, res) => {
    Order.find().populate('product')
        .exec().
        then(data => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json({ message: "NO valid entry found for provided ID" })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })

})

router.post('/', auth, (req, res) => {
    const order = new Order({
        product: req.body.productId,
        quantity: req.body.quantity
    });

    Product.findById(req.body.productId)
        .exec()
        .then(data => {
            if (data) {
                order.save()
            } else {
                return res.status(404).json({ message: "NO valid entry found for provided Product" })
            }
        }).then(result => {
            res.status(201).json({
                message: "Order added Succesfully"
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })


})


router.get('/:orderId', auth, (req, res) => {
    const id = req.params.orderId;
    Order.findById(id).populate('product')
        .exec().
        then(data => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json({ message: "NO valid entry found for provided ID" })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})


router.delete('/:orderId', auth, (req, res) => {
    const id = req.params.orderId;
    Order.findByIdAndDelete(id, (err, response) => {
        if (response) {
            res.status(200).json({ message: "order deleted Successfuly" })
        } else if (err) {
            res.status(500).json({ error: err })
        }
        else {
            res.status(404).json({ message: "NO valid entry found for provided ID" })
        }
    })

})

module.exports = router;