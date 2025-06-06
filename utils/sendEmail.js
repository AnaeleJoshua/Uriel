const nodemailer = require('nodemailer');
const path = require('path')

//set up mail transport 
require('dotenv').config();

// const transporter = nodemailer.createTransport({
//     // service: process.env.MAIL_TRANSPORTER,
//     host: process.env.MAIL_HOST,
//     port: parseInt(process.env.MAIL_PORT),
//     secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
//     auth:{
//         user:process.env.EMAIL_CONFIG_EMAIL,
//         pass:process.env.EMAIL_CONFIG_PASSWORD
//     }
   

// })

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE , // true for 465, false for other ports
    auth: {
        user: process.env.USERNAME,
        pass: process.env.SENDGRID_API_KEY,
    }
})

//function to send mail
// {
        //    name:'Uriel',
        //    address: process.env.EMAIL_CONFIG_EMAIL,}
const sendEmail = (to,subject,htmlContent)=>{
    const mailOptions ={
        from:  '"Josh 👨🏽‍💻" <anaelejoshua@gmail.com>',
        to,
        subject,
        html:htmlContent + `<br> <img src="cid:unique" width="400">`,
        attachments:[
            {
                filename:'uriel_bg',
                path:path.join(__dirname,'../src/images','uriel_bg.png'),
                contentType:'image/png',
                cid:'unique'
        },
        //     {
        //         filename:'josh',
        //         path:path.join(__dirname,'../','josh.png'),
        //         contentType:'image/png',
                
        // }
    ]

    }
    // console.log("html",mailOptions.html)
    // console.log("filepath",mailOptions.attachments[0].path)
return transporter.sendMail(mailOptions)
.then((info) => {
    console.log('Email sent:', info.response);      

}  )
.catch((error) => {
    console.error('Error sending email:', error);
});
}
// sendEmail('anaelejoshua0508@gmail.com','test','<h1>hello</h1>')
//     .then((info) => {
//         console.log('Email sent:', info.response);
//     })
//     .catch((error) => {
//         console.error('Error sending email:', error);
//     });
    // return transporter.sendMail(mailOptions)
    // .then((info) => {
    //     console.log('Email sent:', info.response);
    // })
    // .catch((error) => {
    //     console.error('Error sending email:', error);
    // });

module.exports = sendEmail

