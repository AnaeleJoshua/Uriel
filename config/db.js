const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelizeInstance;

const initializeSequelize = async () => {
  try {
    if (!sequelizeInstance) {
      if (process.env.NODE_ENV === "production") {
        // ✅ Production: use connection string
        if(!process.env.DATABASE_URL){
          console.log(process.env.DATABASE_URL)
          throw new Error("Database url is not defined")
        }else{
          console.log(process.env.DATABASE_URL)
          sequelizeInstance = new Sequelize(process.env.DATABASE_URL, {
          dialect: "postgres",
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false, // for Vercel/Neon/etc.
            },
          },
          logging: false,
        });
        }
      } else {
        // ✅ Development: use individual credentials
        sequelizeInstance = new Sequelize(
          process.env.DATABASE_NAME || "uriel_db_dev",
          process.env.DB_USERNAME || "postgres",
          process.env.DB_PASSWORD || "postgres",
          {
            host: process.env.DB_HOST || "127.0.0.1",
            dialect: "postgres",
            logging: false,
          }
        );
      }

      await sequelizeInstance.authenticate();
      console.log("DB connected");
    }

    return sequelizeInstance;
  } catch (err) {
    console.error("Unable to connect to the database", err);
    throw err;
  }
};

const getSequelizeInstance = async () => {
  return await initializeSequelize();
};

module.exports = getSequelizeInstance;





// const dbConn = async()=>{
//     let sequelize
// try{
//   if (process.env.NODE_ENV === 'production'){
//      sequelize = new Sequelize(process.env.POSTGRES_URL, {
//         dialect: 'postgres',
//         dialectModule:require('pg'),
//         protocol: 'postgres',
//         logging: false,
//     })
//   }else {
//      sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
//         host:"localhost",
//         dialect: "postgres",
//       });
//   }
   

// await sequelize.authenticate()
// console.log("cpnnected successfully")
// return sequelize

// }catch(err){
//     if (err instanceof Sequelize.ConnectionError){
//       console.error('Connection error:', err.original)
//       console.log(`sequelize connection not created: ${err}`)
//     }
//     else if (err instanceof Sequelize.TimeoutError) {
//       console.error('Timeout error:', err.original);
//     } else{
//       console.error("Error connecting to database",err)
//     }
//   }
// }

// const sequelize = dbConn()

// console.log("cpnnected\n",sequelize)
// module.exports =  {databaseConn}
