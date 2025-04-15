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
    const testUrl = `http://localhost:5000/api/v1`

    const confirmation_url = `${testUrl}/auth/confirmation-email?token=${token}`
    const data = {
        name: user.firstName,
        confirmationUrl: confirmation_url,
    }
    const htmlContent = await renderTemplate(data)
    return sendEmail(user.email,'Email Confirmation',htmlContent)
}

module.exports = sendConfirmationEmail