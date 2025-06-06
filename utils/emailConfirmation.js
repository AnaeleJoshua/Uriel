const sendEmail = require('./sendEmail')
const {generateRandomToken} = require('./utility')
const ejs = require('ejs');
const path = require('path');


// Render EJS template
const templatePath = path.join(__dirname, '../email_templates', 'welcome.ejs');

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
const sendConfirmationEmail = async (user,hostUrl)=>{
    const token = generateRandomToken()
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + 24)
    console.log("user-here",user)
    //save token and expiration to db
    user.confirmationCode = token
    user.confirmationExpires = expirationDate;
    await user.save()
    const confirmation_url = `${hostUrl}/api/v1/auth/confirmation-email?token=${token}`
    const data = {
        name: user.firstName,
        confirmationUrl: confirmation_url,
        logoUrl: '../src/images/uriel.png',
        siteUrl: 'Uriel.com',
        User_name: user.firstName,
        User_email: user.email,
        companyName: 'Uriel'
    }
    console.log("data",data)
    const htmlContent = await renderTemplate(data)
    return sendEmail(user.email,'Email Confirmation',htmlContent)
}

module.exports = sendConfirmationEmail