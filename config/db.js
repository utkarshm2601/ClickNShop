const mongoose = require('mongoose');
const colors=require('colors');
exports.connectDb = async (req, res) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to DataBase ${conn.connection.host}`.bgGreen.white);
  }
  catch (error) {
    console.log(`Error in DB Connection ${error}`.bgRed.white);
  }
};