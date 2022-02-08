const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const productRoute = require('./Routes/products')
const ordersRoute = require('./Routes/orders')
const userRoute = require('./Routes/users')
const port = process.env.PORT || 3500;

require('dotenv').config()


const app = express()
//database connection
require('./db/connect')

//morgan for logging
app.use(morgan('dev'))
app.use("/uploads", express.static("uploads"));

//body-parser
app.use(bodyParser.json())


//cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Origin", "Origin,X-Requested-With,Content-Type,Accept,Authorization")
    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow_Methods', 'PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    }
    next();
})

require('./middleware/mailer')

//Routes
app.use('/', userRoute)
app.use('/products', productRoute);
app.use('/orders', ordersRoute);


//error-handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    console.log("hello")
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        errors: {
            message: error.message
        }
    })
})


app.listen(port, () => {
    console.log(`server running at ${port}`)
});