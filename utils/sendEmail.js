const nodemailer = require('nodemailer');
const path = require('path')

//set up mail transport 
require('dotenv').config();
console.log({
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_SECURE: process.env.MAIL_SECURE,
    EMAIL: process.env.EMAIL_CONFIG_EMAIL
  });
  

const transporter = nodemailer.createTransport({
    // service: process.env.MAIL_TRANSPORTER,
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth:{
        user:process.env.EMAIL_CONFIG_EMAIL,
        pass:process.env.EMAIL_CONFIG_PASSWORD
    }
   

})

//function to send mail
const sendEmail = (to,subject,htmlContent)=>{
    const mailOptions ={
        from:{
           name:'Uriel',
           address: process.env.EMAIL_CONFIG_EMAIL,},
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

