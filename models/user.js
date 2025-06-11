'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Organisation, {
    through: models.UserOrganisation,
    foreignKey: 'userId',
    otherKey: 'orgId',
    onDelete: 'CASCADE'
  });
    }
  }
 User.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  phone: DataTypes.STRING,
  refreshToken: DataTypes.STRING,
  displayImage: DataTypes.STRING,
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  confirmationCode: DataTypes.STRING,
  confirmationExpires: DataTypes.DATE,
  resetPasswordCode: DataTypes.STRING,
  resetPasswordExpires: DataTypes.DATE,
}, {
    sequelize,
    modelName: 'User',
     tableName: 'user_account',  // This must match your actual DB table name
    freezeTableName: true, 
  });
  return User;
};