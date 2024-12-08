const { Sequelize} = require("sequelize");
require('dotenv').config()

let sequelizeInstance

const initializeSequelize = async ()=>{
  try{
    if(!sequelizeInstance){
      console.log("Initiallizing new database connection ...")
      if (process.env.NODE_ENV === "production"){
        sequelizeInstance = new Sequelize(process.env.DATABASE_URL,{
          dialect: "postgres",
          dialectModule : require("pg"),
          protocol: "postgres",
          logging:false,
        })
      }else {
         sequelizeInstance = new Sequelize(process.env.DATABASE_NAME,process.env.DB_USERNAME, process.env.DB_PASSWORD,{
          host:"localhost",
          dialect: "postgres",
          logging: console.log
         }) 
      }
      //test the connection
    await sequelizeInstance.authenticate();
    console.log(await sequelizeInstance.getQueryInterface().showAllSchemas());

    console.log("Database connection established successfully")
    }
    return sequelizeInstance
    

  }catch(err){
    console.error("Unable to connect to the database",err);
    throw err;
  }
}

//Export the function to retrieve connection
const getSequelizeInstance = async() => {
  return await initializeSequelize()
}

module.exports = getSequelizeInstance




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
