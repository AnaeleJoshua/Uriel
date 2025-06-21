const dbInitialization = require("../models/modelInit");

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
    const payload = req.body;

    const transaction = await sequelize.transaction();

    try {
      const [updatedRows] = await User.update(payload, {
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
    const { User} = models;
    const { id } = req.params;
    const { file } = req;

    if (!file) {
      return res
        .status(400)
        .json({ status: "Bad Request", message: "No file uploaded" });
    }

    const fileUrl = file.path;
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findOne({
        where: { userId: id },
        transaction,
      });

      if (!user) {
        throw new Error("User not found");
      }

      user.avatarUrl = fileUrl;
      await user.save({ transaction });

      await transaction.commit();
      return res.status(200).json({
        status: "success",
        message: "File uploaded",
        fileUrl,
      });
    } catch (err) {
      console.error(err);
      await transaction.rollback();
      return res.status(400).json({
        status: "Bad Request",
        message: "File upload failed",
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
