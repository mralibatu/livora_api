const { Sequelize } = require("sequelize");
const wordModel = require("../models/word.model");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB, //name of db
    process.env.USER, //sql server username
    process.env.PASSWORD, //sql server password
    {
        host: process.env.HOST, //server name of mssql
        port: process.env.SQL_PORT, //for tcp 1433
        dialect: process.env.DIALECT, //mssql for mssql
        dialectOptions:{
            options: {encrypt: false},
        },
    }
);

const db = {};
db.Word = wordModel(sequelize); //creating models

sequelize.sync({alter:true}); //Sync all models with db

module.exports = db;