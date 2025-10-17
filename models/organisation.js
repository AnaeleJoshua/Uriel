'use strict';
const {
  Model
} = require('sequelize');
const {createId} = require('@paralleldrive/cuid2');
module.exports = (sequelize, DataTypes) => {
  class Organisation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       this.belongsToMany(models.User, {
    through: models.UserOrganisation,
    foreignKey: 'orgId',
    otherKey: 'userId',
    onDelete: 'CASCADE'
  });
  Organisation.hasMany(models.Project, { foreignKey: 'organisationId', as: 'projects' });

    }
  }
  Organisation.init({
  orgId: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => createId(),
    allowNull: false,
  },
  orgName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.STRING,
  ownerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: DataTypes.STRING
}, {
    sequelize,
    modelName: 'Organisation',
    tableName: 'organisation',  // This must match your actual DB table name
    freezeTableName: true,
  });
  return Organisation;
};