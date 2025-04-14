const sendEmail = require('./sendEmail')
const {generateRandomToken} = require('./utility')

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
    console.log("url",confirmation_url)
    const htmlContent = `<p> Hi ${user.firstName},</p>
                        <p>Please click the link below to confirm your email address:</p>
                        <a href="${confirmation_url}">Confirm email</a>
                        `

                    return sendEmail(user.email,'Email Confirmation',htmlContent)
}

module.exports = sendConfirmationEmail