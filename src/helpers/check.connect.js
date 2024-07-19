const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

const checkOverloadConect = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    console.log(`Number of connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    console.log(`Number of cores: ${numCore}`);
    const maxConnection = numCore * 2;
    if (numConnection > maxConnection) {
      console.log("Overload connection");
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverloadConect,
};
