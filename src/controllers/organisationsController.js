const dbInitialization = require("../models/modelInit");
// Removed getSequelizeInstance import


module.exports = {
  // Get organization by ID
  getOrganisationById: async (req, res) => {
    const { models, sequelize } = await dbInitialization;
    const { Organisation } = models; // Destructure Organisation from models
    const transaction = await sequelize.transaction();
    try {
      const { orgId } = req.params;

      const organisation = await Organisation.findOne(
        { where: { orgId: orgId }, transaction } // transaction should be in options object here
      );

      if (!organisation) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "Organization not found",
        });
      }

      await transaction.commit();
      return res.status(200).json({
        status: "success",
        data: organisation.toJSON(),
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error fetching organization:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve the organization",
      });
    }
  },

  // Get all organizations associated with a user
  getAllOrganisation: async (req, res) => {
    const userId = req.user.userId;
    const { models, sequelize } = await dbInitialization;
    const { Organisation } = models; // Destructure Organisation from models
    const { User } = models; // Destructure User from models
    const transaction = await sequelize.transaction();

    try {
      const userOrganisations = await Organisation.findAll(
        { include: [{ model: User, where: { userId } }], transaction }
      );

      if (!userOrganisations.length) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "No organizations found for the user",
        });
      }

      await transaction.commit();
      return res.status(200).json({
        status: "success",
        data: userOrganisations.map((org) => ({
          orgId: org.orgId,
          orgName: org.orgName,
          description: org.description,
          createdBy: org.createdBy,
        })),
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error fetching organizations:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve organizations",
      });
    }
  },

  // Create a new organization
  newOrganisation: async (req, res) => {
    const { models, sequelize } = await dbInitialization;
    const { Organisation } = models; // Destructure Organisation from models
    const { UserOrganisation } = models; // Destructure UserOrganisation from models
    const { User } = models; // Destructure User from models
    const transaction = await sequelize.transaction();
    const payload = req.body;
    const userId = req.user.userId;

    try {
      const user = await User.findOne({ where: { userId }, transaction });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "User not found",
        });
      }

      const newOrg = await Organisation.create(
        { ...payload, createdBy: `${user.firstName} ${user.lastName}`,ownerId:userId },
        { transaction }
      );

      await UserOrganisation.create(
        { userId, orgId: newOrg.orgId },
        { transaction }
      );

      await transaction.commit();
      return res.status(201).json({
        status: "success",
        message: "Organization created successfully",
        data: {
          orgId: newOrg.orgId,
          name: newOrg.name,
          description: newOrg.description,
          createdBy: newOrg.createdBy,
        },
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error creating organization:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to create the organization",
      });
    }
  },

  // Add a user to an organization
  addUserToOrganisation: async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;
    const { models, sequelize } = await dbInitialization;
    const { Organisation } = models; // Destructure Organisation from models
    const { UserOrganisation } = models; // Destructure UserOrganisation from models
    const { User } = models; // Destructure User from models
    // Start a transaction
    if (!userId) {
      return res.status(400).json({
        status: "Bad Request",
        message: "User ID is required",
      });
    }
    const transaction = await sequelize.transaction();

    try {
      const organisation = await Organisation.findOne(
        { where: { orgId }, transaction }
      );

      if (!organisation) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "Organization not found",
        });
      }

      await UserOrganisation.create({ userId, orgId }, { transaction });
      await transaction.commit();

      return res.status(200).json({
        status: "success",
        message: "User successfully added to the organization",
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error adding user to organization:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to add the user to the organization",
      });
    }
  },

  // remove a user from an organization
  removeUserFromOrganisation: async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;
    const { models, sequelize } = await dbInitialization;
    const { Organisation } = models; // Destructure Organisation from models
    const { UserOrganisation } = models; // Destructure UserOrganisation from models
    // Start a transaction
    if (!userId) {
      return res.status(400).json({
        status: "Bad Request",
        message: "User ID is required",
      });
    }
    const transaction = await sequelize.transaction();

    try {
      const user = await UserOrganisation.findOne(
        { where: { userId, orgId }, transaction }
      );
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "User not found in the organization",
        });
      }
      const organisation = await Organisation.findOne(
        { where: { orgId }, transaction }
      );
      if (!organisation) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "Organization not found",
        });
      }
      // Check if the user is the owner
      if (user.userId === organisation.ownerId) {
        await transaction.rollback();
        return res.status(400).json({
          status: "Bad Request",
          message: "Owner cannot be removed from the organization",
        });
      }

      // Remove the user from the organization
      await UserOrganisation.destroy(
        { where: { userId, orgId }, transaction }
      );

      await transaction.commit();
      return res.status(200).json({
        status: "success",
        message: "User removed successfully",
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error removing user from organization:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to remove the user from the organization",
      });
    }
  },

  // get all users in an organisation
  getAllOrganisationUsers: async (req, res) => {
    const { orgId } = req.params;
    const { models, sequelize } = await dbInitialization;
    const { User } = models; // Destructure User from models
    // Start a transaction
    const { Organisation } = models; // Destructure Organisation from models


    try {
      const organisationUsers = await User.findAll(
        { include: [{ model: Organisation, where: { orgId } }] },{transaction: sequelize.transaction() }
      );
      if (!organisationUsers.length) {
        return res.status(404).json({
          status: "Not Found",
          message: "No user found for this organisation",
        });
      }

      return res.status(200).json({
        status: "success",
        data: organisationUsers.map((user) => ({
          userId: user.userId,
          name: `${user.firstName} ${user.lastName}`,
        })),
      });
    } catch (error) {
      console.error("Error fetching users for organization:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve users for the organization",
      });
    }
  },

  // add an admin to organisation
  assignAdmin: async (req, res) => {
    const userId = req.body.userId;
    const { orgId } = req.params;
    const { models, sequelize } = await dbInitialization;
    const { Organisation } = models; // Destructure Organisation from models
    const { UserOrganisation } = models; // Destructure UserOrganisation from models

    const transaction = await sequelize.transaction();

    try {
      const organisation = await Organisation.findOne(
        { where: { orgId }, transaction }
      );

      if (!organisation) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "Organization not found",
        });
      }

      const userOrganisation = await UserOrganisation.findOne(
        { where: { userId, orgId }, transaction }
      );

      if (!userOrganisation) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "User not found in the organization",
        });
      }
      // Check if the user is already an admin
      if (userOrganisation.role === 'admin') {
        await transaction.rollback();
        return res.status(400).json({
          status: "Bad Request",
          message: "User is already an admin of the organization",
        });
      }
      // Update the user's role to admin
      await UserOrganisation.update(
        { role: 'admin' },
        { where: { userId, orgId }, transaction }
      );

      await transaction.commit();

      return res.status(200).json({
        status: "success",
        message: "User successfully assigned as admin to the organization",
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error assigning admin to organization:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to assign the user as admin to the organization",
      });
    }
  },

  // change admin to regular user in organisation
  removeAdmin: async (req, res) => {
    const userId = req.body.userId;
    const { orgId } = req.params;
    const { models, sequelize } = await dbInitialization;
    const { Organisation } = models; // Destructure Organisation from models
    const { UserOrganisation } = models; // Destructure UserOrganisation from models
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      const organisation = await Organisation.findOne(
        { where: { orgId }, transaction }
      );

      if (!organisation) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "Organization not found",
        });
      }

      const userOrganisation = await UserOrganisation.findOne(
        { where: { userId, orgId }, transaction }
      );

      if (!userOrganisation) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "User not found in the organization",
        });
      }
      // Check if the user is not an admin
      if (userOrganisation.role !== 'admin') {
        await transaction.rollback();
        return res.status(400).json({
          status: "Bad Request",
          message: "User is not an admin of the organization",
        });
      }
      // Update the user's role to user
      await UserOrganisation.update(
        { role: 'user' },
        { where: { userId, orgId }, transaction }
      );

      await transaction.commit();

      return res.status(200).json({
        status: "success",
        message: "Admin role removed successfully",
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error removing admin role:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to remove admin role from user",
      });
    }
  },
};
