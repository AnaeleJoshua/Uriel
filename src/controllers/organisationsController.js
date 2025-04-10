const dbInitialization = require("../models/modelInit");
const getSequelizeInstance = require("../../config/db");
const Organisation = require( "../models/Organisation" );

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
  // remove a user from an organization
  removeUserFromOrganisation: async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;
    const {UserOrganisation } = await dbInitialization;
    const sequelize = await getSequelizeInstance();
    const transaction = await sequelize.transaction();

    try {
       const user = await UserOrganisation.findOne(
        { where: { userId, orgId } },
        { transaction }
      );
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "User not found in the organization",
        });
      }
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
      // Check if the user is the owner
      if (user.userId === organisation.ownerId) {
        await transaction.rollback();
        return res.status(400).json({
          status: "Bad Request",
          message: "Owner cannot be removed from the organization",
        });
      }
    
      //admin can be removed by owner
      // Remove the user from the organization
      await UserOrganisation.destroy(
        { where: { userId, orgId } },
        { transaction }
      );

      return res.status(200).json({
        status: "success",
        message: "User removed successfully",
      });
      }
    catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error removing user from organization:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to remove the user to the organization",
      });
    }
  },

  //get all users in an organisation
  getAllOrganisationUsers:async (req,res) => {
      const {orgId} = req.params
      try{
        const organisationUsers = await User.findAll(
          { include: [{ model: Organisation, where: { orgId } }] },
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
            name: user.name,
          })),


      })

    }catch(error){
      console.error("Error adding user to organization:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to add the user to the organization",
      });
    }
  },

  //add an admin to organisation
  assignAdmin: async (req,res)=>{
    const userId = req.body.userId
    const {orgId} = req.params
    const {UserOrganisation} = await dbInitialization 
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

      const userOrganisation = await UserOrganisation.findOne(
        { where: { userId, orgId } },
        { transaction }
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

  //change admin to regular to organisation
  removeAdmin: async (req,res)=>{
    const userId = req.body.userId
    const {orgId} = req.params
    const {UserOrganisation} = await dbInitialization 
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

      const userOrganisation = await UserOrganisation.findOne(
        { where: { userId, orgId } },
        { transaction }
      );

      if (!userOrganisation) {
        await transaction.rollback();
        return res.status(404).json({
          status: "Not Found",
          message: "User not found in the organization",
        });
      }
      // Check if the user is not an admin
      if (userOrganisation.role !== 'user') {
        await transaction.rollback();
        return res.status(400).json({
          status: "Bad Request",
          message: "User not an admin of the organization",
        });
      }
      // Update the user's role to user
      await UserOrganisation.update(
        { role: 'user' },
        { where: { userId, orgId }, transaction }
      );

  }catch (error) {
      if (transaction) await transaction.rollback();
      console.error("Error removing admin role:", error.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to remove admin role from user",
      });
    }
}
}

