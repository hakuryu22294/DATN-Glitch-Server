const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const PASSWORD = "yXdw10aboL0sFcMs";
const connectString = `mongodb+srv://kaminariryuo:${PASSWORD}@glitch-db.7g41rh4.mongodb.net/?retryWrites=true&w=majority&appName=glitch-db`;

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 === 1) {
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
