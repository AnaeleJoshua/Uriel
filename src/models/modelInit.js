// modelInit.js
const getSequelizeInstance = require('../../config/db');
const db = require('../../models'); // Sequelize CLI-generated models

const InitializeDB = async () => {
  const sequelize = await getSequelizeInstance();
  return { sequelize, models: db };
};

module.exports = InitializeDB();
