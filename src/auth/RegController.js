const dbInitialization = require("../models/modelInit");
const { generateAccessToken, generateRefreshToken, encryptPassword } = require('../../utils/utility');
const organisation = require("../schemas/organisation");
const sendConfirmationEmail = require('../../utils/emailConfirmation')

const handleRegister = async (req, res) => {
  try {
    // Ensure models and sequelize instance are loaded
    const { User, Organisation,UserOrganisation } = await dbInitialization;

    const payload = req.body;
    const payloadEmail = payload.email;
    console.log("Payload email:", payloadEmail);
    console.log("Payload pass:", payload.password);

    // Start a database transaction
    const sequelize = User.sequelize; // Get Sequelize instance from the User model
    const transaction = await sequelize.transaction();
    console.log(UserOrganisation.getTableName());

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email: payloadEmail }, transaction });
      if (existingUser) {
        await transaction.rollback();
        return res.status(400).json({
          status: "Bad request",
          message: "Email already exists",
          statusCode: 400,
        });
      }
      // Encrypt the user's password
      const encryptedPassword = await encryptPassword(payload.password);
      console.log(encryptedPassword)
      // Create a new user with the encrypted password
      const newUser = await User.create(
        {
          ...payload,
          password: encryptedPassword,
        },
        { transaction }
      );

      // Create a new organization for the user
      const newOrganisation = await Organisation.create(
        {
          name: `${newUser.firstName}'s Organisation`,
          description: `${newUser.firstName}'s organisation`,
          createdBy: `${newUser.firstName} ${newUser.lastName}`,
          ownerId: newUser.userId
        },
        { transaction }
      );

      // Associate the user with the organization
      await newUser.addOrganisation(newOrganisation, { transaction });
        //update role in organisation to owner

      // await newUser.addUserOrganisation(,{transaction})

      // Generate access and refresh tokens
      const accessToken = generateAccessToken(payloadEmail, newUser.userId);
      const refreshToken = generateRefreshToken(payloadEmail, newUser.userId);

      // Update the user with the refresh token
      await newUser.update({ refreshToken }, { transaction });

      //email confirmation
      const baseUrl = `${req.protocol}://${req.get('host')}`
      console.log("baseUrl",baseUrl)
      console.log("newUser",newUser)
      const sentEmail = await sendConfirmationEmail(newUser,baseUrl)
      console.log("sentEmail",sentEmail)
      if(!sentEmail){
        await transaction.rollback();
        return res.status(500).json({
          status: "error",
          message: "Failed to send confirmation email",
          statusCode: 500,
        });
      }


      // Commit the transaction
      await transaction.commit();

      // Set the refresh token as an HTTP-only cookie
      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // Send a success response
      return res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken,
          user: {
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            organisation_name: newOrganisation.name,
            organisation_id:newOrganisation.orgId,
            email_status: 'check your email for a confirmation mail'
          },
        },
      });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error("Registration error:", error.message);
    return res.status(500).json({
      status: "error",
      message: "An error occurred during registration",
      statusCode: 500,
      error: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });
  }
};

module.exports = handleRegister;
