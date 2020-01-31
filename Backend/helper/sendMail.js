var nodemailer = require('nodemailer');

function send(message) {
    return new Promise((resolve, reject) => {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
                user: 'YOURMAIL@gmail.com',
                pass: 'PASSWORD'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'YOURMAIL@gmail.com',
            to: 'SENDMAIL@gmail.com',
            subject: 'İletişim Formu Mesajı',
            text: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve("İşlem Başarıyla Gerçekleşti");
            }
        });
    });
}

module.exports = {
    mailSend: function (message) {
        return send(message);
    }
};