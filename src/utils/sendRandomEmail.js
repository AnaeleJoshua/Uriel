const sendEmail = require('./sendEmail')
const ejs = require('ejs');
const path = require('path');


// Render EJS template
const templatePath = path.join(__dirname, '../email_templates', 'friends.ejs');

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
const sendConfirmationEmail = async (user)=>{
    const data = {
        name: user,
        
    }
    const htmlContent = await renderTemplate(data)
    return sendEmail(['miraclefavour64@gmail.com','anaelejoshua0508@gmail.com'],'Email Confirmation',htmlContent)
}

sendConfirmationEmail('Miracle')