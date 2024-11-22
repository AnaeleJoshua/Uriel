const { DataTypes } = require("sequelize");

let UserOrganisation; // Store the model instance

const UserOrganisationModel = {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users", // Matches the table name of the User model
      key: "userId",
    },
    onDelete: "CASCADE", // Ensures deletion cascades for related records
  },
  orgId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "organisations", // Matches the table name of the Organisation model
      key: "orgId",
    },
    onDelete: "CASCADE",
  },
};

module.exports = {
  initialize: (sequelize) => {
    // Define and store the model
    UserOrganisation = sequelize.define("userOrganisation", UserOrganisationModel);
    return UserOrganisation;
  },
};
