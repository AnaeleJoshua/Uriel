const sendEmail = require('../../utils/sendEmail');
const dbInitialization = require('../models/modelInit');
const { generateRandomToken, encryptPassword } = require('../../utils/utility');
const ejs = require('ejs');
const path = require('path');
const { Op } = require('sequelize');

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
};

async function sendPasswordResetMail(req, res) {
    const { models: { User } } = await dbInitialization;

    const email = req.body.email;
    console.log('Change password email:', email);

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send('Invalid email');

    const token = generateRandomToken();
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);

    user.confirmationCode = token;
    user.confirmationExpires = expirationDate;
    await user.save();

    const hostUrl = `${req.protocol}://${req.get('host')}`;
    const confirmation_url = `${hostUrl}/new_password_form.html?token=${token}`;

    const data = {
        name: user.firstName,
        confirmationUrl: confirmation_url,
        siteUrl: 'uriel.com',
        logoUrl: 'https://imgur.com/a/jyl8HRg',
        User_name: user.firstName,
        User_email: user.email,
        companyName: 'Uriel',
        expiryHours: 24,
    };

    try {
        const htmlContent = await renderTemplate(data);
        await sendEmail(user.email, 'Password Recovery', htmlContent);
        console.log('Email sent successfully');
        res.status(200).send('Password recovery email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send password reset email');
    }
}

async function confirmPassword(req, res) {
    const { token, password } = req.body;
    const { models: { User } } = await dbInitialization;
    console.log("token",token)
    // const user = await User.findOne({
    //     where: {
    //         confirmationCode: token,
    //         confirmationExpires: { [Op.gt]: new Date() }
    //     }
    // });

    // if (!user) return res.status(400).send('Invalid or expired token');

    const encryptedPassword = await encryptPassword(password);
    console.log('encrypted pass',encryptPassword)
    // user.password = encryptedPassword;
    // user.confirmationCode = null;
    // user.confirmationExpires = null;
    // await user.save();

    // Redirect to the success page
    res.redirect('/password-reset-success.html');
}

module.exports = { sendPasswordResetMail, confirmPassword };
