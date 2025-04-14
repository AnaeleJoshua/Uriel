const getSequelizeInstance = require('../../config/db');
// Importing model definitions
const UserModel = require("./User");
const OrganisationModel = require("./Organisation");
const UserOrganisationModel = require("./UserOrganisation");

let User, Organisation, UserOrganisation;

const InitializeDB = async () => {
  try {
    const sequelize = await getSequelizeInstance();

    // Initialize models
    User = UserModel.initialize(sequelize);
    Organisation = OrganisationModel.initialize(sequelize);
    UserOrganisation = UserOrganisationModel.initialize(sequelize);

    // Verify model initialization
    if (!User || !Organisation || !UserOrganisation) {
      throw new Error("Model initialization failed!");
    }

    console.log("Models initialized successfully.");

    // Define relationships
    User.belongsToMany(Organisation, {
      through: UserOrganisation,
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Organisation.belongsToMany(User, {
      through: UserOrganisation,
      foreignKey: 'orgId',
      onDelete: 'CASCADE',
    });

    // Sync models with the database
    await sequelize.sync({ force:true }); // Use `alter` for safe schema updates in production
    console.log("Database synchronized successfully.");

    // Return initialized models
    return { sequelize, User, Organisation, UserOrganisation };
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    throw error; // Rethrow error for further handling
  }
};

// Export a promise that resolves with the models
const dbInitialization = InitializeDB();

module.exports = dbInitialization;
