const nodemailer = require('nodemailer')


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'rajputtushar308@gmail.com',
        pass: process.env.PASS
    }
})

module.exports = transporter.sendMail({
    from: 'rajputtushar308@gmail.com',
    to: 'rajputtushar309@gmail.com',
    subject: 'hello world!',
    text: 'hello world!'
}, (err, detail) => {
    if (err) {
        console.log(err)
        return;
    }
    console.log(detail)
});


