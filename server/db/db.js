const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
  const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjyed.mongodb.net/chat-app?retryWrites=true&w=majority`;
  // const url=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@appcluster.shilt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to DB");
  } catch (err) {
    console.log(`Error connecting to DB: ${err}`);
  }
};

module.exports = { connectToDB };
