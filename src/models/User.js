const { DataTypes } = require("sequelize");

let User; // Store the model instance

const UserModel = {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  displayImage:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  confirmationCode:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  confirmationExpires:{
    type: DataTypes.DATE,
    allowNull: true,
  },
  resetPasswordCode:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires:{
    type: DataTypes.DATE,
    allowNull: true,
  }
};

module.exports = {
  initialize: (sequelize) => {
    // Define the model and store it
    User = sequelize.define("user", UserModel,{
      tableName: "user_account", // prevent Sequelize from pluralizing
      freezeTableName: true // enforce exact name
    });
    return User;
  },
};
