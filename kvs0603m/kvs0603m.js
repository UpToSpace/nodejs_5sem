const nodemailer = require('nodemailer')
const config = require('D:/University/cross/labs/lab6/config')
const receiver = 'valerie143@mail.ru'

let send = (message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.mail,
            pass: config.mailpassword,
        },
    });
    const options = {
        from: config.mail,
        to: receiver,
        text: message,
    }

    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Sent: " + info.response);
    })
}

module.exports = send