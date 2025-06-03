const sendEmail = require('../../utils/sendEmail')
const dbInitialization = require('../models/modelInit')
const {generateRandomToken} = require('../../utils/utility')
const ejs = require('ejs');
const path = require('path');

// Render EJS template
const templatePath = path.join(__dirname, '../../email_templates', 'password.ejs');

const renderTemplate = (data) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, data, (err, html) => {
            if (err) {
                console.error('Error rendering EJS template:', err);
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}

async function sendPasswordResetMail(req,res){
    const {User} = await dbInitialization
    const email = req.body.email
    console.log('change password email',email)
    const user = await User.findOne({where:{email}})
    console.log(user)
    if(!user) return res.status(400).send('invalid email')
    const token = generateRandomToken()
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + 24)
    user.confirmationCode = token
    user.confirmationExpires = expirationDate;
    await user.save()
    const hostUrl = `${req.protocol}://${req.get('host')}`
    const confirmation_url = `${hostUrl}/new_password_form.html?token=${token}`
    const data = {
        name: user.firstName,
        confirmationUrl: confirmation_url,
        siteUrl: 'uriel.com',
        logoUrl: 'https://imgur.com/a/jyl8HRg',
        User_name: user.firstName,
        User_email: user.email,
        companyName: 'Uriel',
        expiryHours: 24,
    }
    const htmlContent = await renderTemplate(data)
    return sendEmail(user.email,'Password Recovery',htmlContent)
    .then(() => {
        console.log('Email sent successfully');
        res.status(200).send('Password recovery email sent successfully');
    })
    .catch((error) => {
        console.error('Error sending email:', error)}
    )

}

async function confirmPassword(req,res){
    //get token and password from request
    const {token,password} = req.body;
    //check for token validity
    const {User} = await dbInitialization;
    const user = await User.findOne({where:{confirmationCode:token,confirmationExpires:{[Op.gt]:new Date()}}})
    if(!user) return res.status(400).send('invalid token')
    //update password
    const encryptedPassword = await encryptPassword(password);
    user.password = encryptedPassword
    user.confirmationCode = null
    user.confirmationExpires = null
    await user.save()
    // Redirect to the success page
    res.redirect('/password-reset-success.html');
    //send success response
    res.status(200).send('password updated successfully')
    
    //send success response
}

module.exports = { sendPasswordResetMail,confirmPassword}