const dbInitialization = require("../models/modelInit");
const getSequelizeInstance = require("../../config/db");

module.exports = {
  // Get organization by ID
  getOrganisationById: async (req, res) => {
    const { Organisation } = await dbInitialization;
    const sequelize = await getSequelizeInstance();
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      const organisation = await Organisation.findOne(
        { where: { orgId: id } },
        { transaction }
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
    const { Organisation, User } = await dbInitialization;
    const sequelize = await getSequelizeInstance();
    const transaction = await sequelize.transaction();

    try {
      const userOrganisations = await Organisation.findAll(
        { include: [{ model: User, where: { userId } }] },
        { transaction }
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
          name: org.name,
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
    const { Organisation, User, UserOrganisation } = await dbInitialization;
    const sequelize = await getSequelizeInstance();
    const transaction = await sequelize.transaction();
    const payload = req.body;
    const userId = req.user.userId;

    try {
      const user = await User.findOne({ where: { userId } }, { transaction });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "User not found",
        });
      }

      const newOrg = await Organisation.create(
        { ...payload, createdBy: `${user.firstName} ${user.lastName}` },
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
    const { Organisation, UserOrganisation } = await dbInitialization;
    const sequelize = await getSequelizeInstance();
    const transaction = await sequelize.transaction();

    try {
      const organisation = await Organisation.findOne(
        { where: { orgId } },
        { transaction }
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
};
