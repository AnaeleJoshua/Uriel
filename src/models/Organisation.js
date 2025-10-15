const { DataTypes } = require("sequelize");
const { createId } = require('@paralleldrive/cuid2');
let Organisation; // Store the model instance

const OrganisationModel = {
  orgId: {
    type: DataTypes.STRING,
    defaultValue: () => createId(),
    primaryKey: true,
  },
  orgName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  ownerId:{
    type:DataTypes.STRING,
    allowNull: false
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  }
};

module.exports = {
  initialize: (sequelize) => {
    // Define and store the model
    Organisation = sequelize.define("organisation", OrganisationModel,{
      tableName: "organisation", // prevent Sequelize from pluralizing
      freezeTableName: true // enforce exact name
    });
    
    return Organisation;
  },
};
