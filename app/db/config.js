const mongoose = require("mongoose");
//const User = require("../models/user");
const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB successfully ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
/*const saveUser = async (newUser) => {
  return await userUser.save();
};
const findUser = async (object) => {
  return await User.find(object).exec();
}*/
module.exports = connectDB;
//module.exports = { connectDB, saveUser, findUser };
