const mongoose = require('mongoose')


const url = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.g4ojw.mongodb.net/ShopRestApi?retryWrites=true&w=majority`


mongoose.connect(url, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("database connected succesfuly")
    }
})

module.exports = mongoose