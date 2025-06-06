// const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const path = require('path')
// const fs = require('fs');

//set up mail transport 
require('dotenv').config();
const baseUrl = process.env.APP_BASE_URL || 'localhost:3000'; // Default to localhost if BASE_URL is not set
console.log("baseUrl:",baseUrl)
const filePath = path.join(__dirname, '../src/images/uriel_bg.png');
console.log("image filePath:",filePath)
// Read the file and convert it to base64
// const fileContent = fs.readFileSync(filePath).toString('base64');
const imageUrl = `${baseUrl}/images/uriel_bg.png`;
const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: '"Josh from Uriel 👨🏽‍💻" <anaelejoshua@gmail.com>',
        to,
        subject,
        html: `
        
            <div style="text-align: center;">
                   <img src="${imageUrl}" alt="Banner" style="width: 100%; max-width: 600px;" />
            </div>
            <div>${htmlContent}</div>
        `,
        // attachments: [
        //     {
        //         content: fileContent,
        //         filename: 'uriel_bg.png',
        //         type: 'image/png',
        //         disposition: 'inline',
        //         content_id: 'bannerImage'
        //     }
        // ]
    };

    try {
    const [response] = await sgMail.send(mailOptions);
    console.log('✅ Email sent. Status code:', response.statusCode);
    return response.statusCode === 202; // Only return true if SendGrid accepted the request
  } catch (error) {
    console.error('❌ Failed to send email:', error.response?.body || error.message);
    return false;
  }
};




module.exports = sendEmail

