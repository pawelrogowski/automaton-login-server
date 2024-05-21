const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.DB_URI, {});
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error("exiting process");
    process.exit(1);
  }
};

module.exports = connectDb;
