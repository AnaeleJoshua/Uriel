const nodemailer = require('nodemailer');
const path = require('path')


const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SENDGRID_USERNAME, // Use your SendGrid username here
        pass: process.env.SENDGRID_API_KEY, // Use your SendGrid API key here
    }
})

const sendEmail = (to,subject,htmlContent)=>{
    const mailOptions ={
        from:  '"Josh 👨🏽‍💻" <anaelejoshua@gmail.com>',
        to,
        subject,
        html:htmlContent + `<br> <img src="cid:unique" width="400">`,
        attachments:[
            {
                filename:'uriel_bg',
                path:path.join(__dirname,'./src/images','uriel_bg.png'),
                contentType:'image/png',
                cid:'unique'
        },
      
    ]

}
return transporter.sendMail(mailOptions)
.then((info) => {
    console.log('Email sent:', info.response);      

}  )
.catch((error) => {
    console.error('Error sending email:', error);
});
}

( async function (){
const result = await sendEmail('anaelejoshua0508@gmail.com','testing','<h1>hello</h1>')
console.log(result)
return result

})()

