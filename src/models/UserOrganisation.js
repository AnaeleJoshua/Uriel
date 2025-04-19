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
  role:{
    type:DataTypes.ENUM('owner','admin','user'),
    defaultValue:'user'
  }
};

module.exports = {
  initialize: (sequelize) => {
    // Define and store the model
    UserOrganisation = sequelize.define("userOrganisation", UserOrganisationModel, {
      tableName: "userOrganisation", // prevent Sequelize from pluralizing
      freezeTableName: true // enforce exact name
    });
    
    return UserOrganisation;
  },
};
