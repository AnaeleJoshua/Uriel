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
  avatarUrl:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified:{
    type: DataTypes.BOOLEAN,
    default: false,
  }
};

module.exports = {
  initialize: (sequelize) => {
    // Define the model and store it
    User = sequelize.define("user", UserModel);
    return User;
  },
};
