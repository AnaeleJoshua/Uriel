const { DataTypes } = require("sequelize");

let Organisation; // Store the model instance

const OrganisationModel = {
  orgId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

module.exports = {
  initialize: (sequelize) => {
    // Define and store the model
    Organisation = sequelize.define("organisation", OrganisationModel);
    return Organisation;
  },
};
