require("dotenv").config();
const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const { MONGO_URI, MONGODB_PASSWORD } = process.env;
const connectString = MONGO_URI.replace("<password>", MONGODB_PASSWORD);

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (2 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => {
        countConnect();
        console.log("Connected to MongoDB");
      })
      .catch((err) => console.log(err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
