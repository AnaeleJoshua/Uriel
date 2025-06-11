require('dotenv').config();
module.exports ={
  "development": {
    "username": process.env.DB_USERNAME || "postgres",
    "password": process.env.DB_PASSWORD || "postgres",
    "database": process.env.DATABASE_NAME || "uriel_db_dev",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "postgres",
    "database": "uriel_db_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
     use_env_variable:process.env.DATABASE_URL ,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For Neon/Vercel compatibility
      },
    }
  }
}
