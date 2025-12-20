const dbInitialization = require("../models/modelInit");
const { generateAccessToken, generateRefreshToken, encryptPassword } = require('../utils/utility');
const sendConfirmationEmail = require('../utils/emailConfirmation');
const { createId } = require('@paralleldrive/cuid2');

const handleRegister = async (req, res) => {
  try {
    // Load sequelize and models
    const { sequelize, models } = await dbInitialization;
    const { User, Organisation, UserOrganisation } = models;

    const payload = req.body;
    const payloadEmail = payload.email.toLowerCase();

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Check if user exists
      const existingUser = await User.findOne({ where: { email: payloadEmail }, transaction });
      if (existingUser) {
        await transaction.rollback();
        return res.status(400).json({
          status: "Bad request",
          message: "User already exists",
          statusCode: 400,
        });
      }

      // Encrypt password
      const encryptedPassword = await encryptPassword(payload.password);

      // Create user
      const userId = createId()
      const newUser = await User.create({
        ...payload,
        password: encryptedPassword,
        userId
      }, { transaction });
console.log(`userId:${newUser.userId}`)
      // Create organisation
      const orgId = createId()
      console.log(`orgId:${orgId}`)
      const newOrganisation = await Organisation.create({
        orgId:orgId,
        orgName: `${newUser.firstName}'s Organisation`,
        description: `${newUser.firstName}'s organisation`,
        createdBy: `${newUser.firstName} ${newUser.lastName}`,
        ownerId: newUser.userId
      }, { transaction });
      console.log(newOrganisation)
      // Add user-organisation association with role
      await UserOrganisation.create({
        userId: newUser.userId,
        orgId: newOrganisation.orgId,
        role: "owner"
      }, { transaction });

      // Generate tokens
      const accessToken = generateAccessToken(payloadEmail, newUser.userId);
      const refreshToken = generateRefreshToken(payloadEmail, newUser.userId);

      // Save refresh token
      await newUser.update({ refreshToken }, { transaction });

      // Email confirmation
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      // const { sent, code, expiration } = await sendConfirmationEmail(newUser, baseUrl, transaction);

      // if (!sent) {
      //   await transaction.rollback();
      //   return res.status(500).json({
      //     status: "error",
      //     message: "Failed to send confirmation email",
      //     statusCode: 500,
      //   });
      // }

      // await newUser.update({ confirmationCode: code, confirmationExpires: expiration }, { transaction });

      await transaction.commit();

      // Set HTTP-only cookie
      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

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
            organisation_id: newOrganisation.orgId,
            email_status: 'Check your email for a confirmation mail',
          },
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
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
