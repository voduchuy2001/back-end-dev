const nodemailer = require('nodemailer')

const sendMail = async ({ email, html, subject }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"VClothing" <no-relply@vclothing.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
    });

    return info
}

module.exports = sendMail