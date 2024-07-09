const app = require("./src/app");
require("dotenv").config();
const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    // notify.send("Server closed", { title: "Server Closed" });
  });
});
