const express = require('express');
const upload = require('../helper/upload');
const Product = require('../models/product')
const auth = require('../middleware/auth')
const fs = require('fs')

const router = express.Router();

router.get('/', (req, res) => {
    Product.find()
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

router.post('/', auth, upload.single('productImg'), (req, res) => {

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productImg: req.file.path
    })

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: "Product added Succesfully"
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        }
        );

})

router.get('/:productId', (req, res) => {
    const id = req.params.productId;
    Product.findById(id)
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

router.patch('/:productId', auth, upload.single('productImg'), (req, res) => {
    const id = req.params.productId;
    const { newName, newPrice } = req.body
    const newProductImg = (req.file) && req.file.path;

    Product.findByIdAndUpdate(id, { $set: { name: newName, price: newPrice, productImg: newProductImg } })
        .exec()
        .then(data => {
            if (data) {
                if (newProductImg && data.productImg) {
                    fs.unlink(data.productImg, (err) => {
                        if (err) {
                            console.log("unlinking error")
                        }
                    })
                }
                res.status(200).json({ message: "product updated Successfuly", data })
            }
            else {
                if (newProductImg) {
                    fs.unlink(newProductImg, (err) => {
                        if (err) {
                            console.log("unlinking error")
                        }
                    })
                }
                res.status(404).json({ message: "NO valid entry found for provided ID" })
            }
        }).catch(err => {
            res.status(500).json({ error: err })
        })


})

router.delete('/:productId', auth, (req, res) => {
    const id = req.params.productId;

    Product.findByIdAndRemove(id, (err, response) => {
        if (response) {
            if (response.productImg) {
                fs.unlink(response.productImg, (err) => {
                    if (err) {
                        console.log("unlinking error")
                    }
                })
            }
            res.status(200).json({ message: "product deleted Successfuly" })
        } else if (err) {
            res.status(500).json({ error: err })
        }
        else {
            res.status(404).json({ message: "NO valid entry found for provided ID" })
        }
    })

})

module.exports = router;