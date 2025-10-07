const dbInitialization = require("../models/modelInit");
const cloudinary = require('../../config/cloudinaryConfig');

module.exports = {
  // Get user by ID
  getUserById: async (req, res) => {
    const { sequelize, models } = await dbInitialization;
    const { User, Organisation, UserOrganisation } = models;
    const { id } = req.params;

    const transaction = await sequelize.transaction();

    try {
      const user = await User.findOne({
        where: { userId: id },
        transaction,
      });

      if (!user) {
        await transaction.rollback();
        return res.status(401).json({
          status: "Bad request",
          message: "Invalid user",
        });
      }

      const organisations = await Organisation.findAll({
        attributes: ["orgName"],
        include: {
          model: User,
          where: { userId: id },
          attributes: [],
        },
        transaction,
      });

      if (organisations.length === 0) {
        await transaction.rollback();
        return res.status(401).json({
          status: "Bad request",
          message: "User does not belong to any organisation",
        });
      }

      await transaction.commit();
      return res.status(200).json({
        status: "success",
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          organisations,
        },
      });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while fetching user",
      });
    }
  },

  // Update user info
  updateUser: async (req, res) => {
    const { models, sequelize } = await dbInitialization;
    const { User } = models;
    
    const { id } = req.params;
    const {firstName,lastName,phone} = req.body;

    const transaction = await sequelize.transaction();

    try {
      const [updatedRows] = await User.update({firstName,lastName,phone}, {
        where: { userId: id },
        transaction,
      });

      if (!updatedRows) {
        throw new Error("No changes applied");
      }

      await transaction.commit();
      return res.status(200).json({
        status: "success",
        message: "Record updated",
      });
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      return res.status(400).json({
        status: "Bad Request",
        message: "Failed to update record",
      });
    }
  },

  // Upload avatar
  uploadAvatar: async (req, res) => {
    const { sequelize, models } = await dbInitialization;
    const { User } = models;
    let { id } = req.params;
    id = id.toString();
    const { file, user } = req; // user added from authentication middleware
    onsole.log(`user_id from token: ${typeof(user.userId)}, param id: ${typeof(id)}`);
    // ✅ Ensure file was uploaded
    if (!file) {
      return res.status(400).json({
        status: 'Bad Request',
        message: 'No file uploaded.',
      });
    }

    // ✅ Security: Ensure users can only upload their own avatar
    if (user.userId !== id) {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'You are not allowed to modify another user’s profile.',
      });
    }

    const fileUrl = file.path; // Cloudinary returns hosted URL
    const transaction = await sequelize.transaction();

    try {
      const existingUser = await User.findOne({ where: { userId: id }, transaction });

      if (!existingUser) {
        throw new Error('User not found.');
      }

      // ✅ Delete old avatar from Cloudinary (if exists)
      if (existingUser.avatarUrl) {
        const publicId = existingUser.avatarUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(`user_${id}/avatars/${publicId}`).catch(() => {});
      }

      // ✅ Update new avatar URL
      existingUser.avatarUrl = fileUrl;
      await existingUser.save({ transaction });
      await transaction.commit();

      return res.status(200).json({
        status: 'success',
        message: 'Avatar uploaded successfully.',
        avatarUrl: fileUrl,
      });
    } catch (err) {
      console.error('Upload error:', err);

      // Rollback transaction
      await transaction.rollback();

      // ✅ Delete uploaded file from Cloudinary if DB update failed
      if (file && file.filename) {
        try {
          await cloudinary.uploader.destroy(file.filename);
        } catch (cleanupErr) {
          console.error('Failed to clean up Cloudinary upload:', cleanupErr);
        }
      }

      return res.status(400).json({
        status: 'Bad Request',
        message: 'File upload failed.',
        error: err.message,
      });
    }
  },


  // Get avatar
  getAvatar: async (req, res) => {
   const { sequelize, models } = await dbInitialization;
    const { User} = models;;
    const { id } = req.params;

    try {
      const user = await User.findOne({
        where: { userId: id },
        attributes: ["avatarUrl"],
      });

      if (!user || !user.avatarUrl) {
        return res
          .status(400)
          .json({ status: "Bad Request", message: "Avatar not found" });
      }

      return res.status(200).json({
        status: "success",
        data: {
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (err) {
      console.error("An error occurred: ", err);
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch avatar",
      });
    }
  },

  // Confirm email (placeholder)
  confirmEmail: async (req, res) => {
    return res.status(200).json({
      status: "success",
      message: "Email confirmation placeholder",
    });
  },
};
