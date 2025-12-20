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
const sendConfirmationEmail = async (user,hostUrl,transaction)=>{
    const token = generateRandomToken()
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + 24)
   
    //save token and expiration to db
    user.confirmationCode = token
    user.confirmationExpires = expirationDate;
    console.log("user.confirmationCode",user.confirmationCode)
    await user.update({
  confirmationCode: token,
  confirmationExpires: expirationDate
},{transaction})
     console.log("user-here",user)
    const confirmation_url = `${hostUrl}/api/v1/auth/confirm-email?token=${token}`
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
    return {
  sent: await sendEmail(user.email, 'Email Confirmation', htmlContent),
  code: token,
    expiration: expirationDate
};

}

module.exports = sendConfirmationEmail