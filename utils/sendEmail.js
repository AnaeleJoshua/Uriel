// const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const path = require('path')
const fs = require('fs');

//set up mail transport 
require('dotenv').config();
const filePath = path.join(__dirname, '../src/images/uriel_bg.png');
console.log("image filePath:",filePath)
// Read the file and convert it to base64
const fileContent = fs.readFileSync(filePath).toString('base64');

const sendEmail = (to, subject, htmlContent) => {
    const mailOptions = {
        from: '"Josh from Uriel 👨🏽‍💻" <anaelejoshua@gmail.com>',
        to,
        subject,
        html: `
            <div style="text-align: center;">
                <img src="cid:bannerImage" width="100%" alt="Banner Image" style="max-width: 600px;" />
            </div>
            <div>${htmlContent}</div>
        `,
        attachments: [
            {
                content: fileContent,
                filename: 'uriel_bg.png',
                type: 'image/png',
                disposition: 'inline',
                content_id: 'bannerImage'
            }
        ]
    };

    return sgMail.send(mailOptions)
        .then((info) => {
            console.log('Email sent:', info);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
};




module.exports = sendEmail

