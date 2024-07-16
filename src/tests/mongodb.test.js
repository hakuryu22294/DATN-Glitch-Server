const mongoose = require("mongoose");
const connectString = "mongodb://localhost:27017";

const TestSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const Test = mongoose.model("Test", TestSchema);

describe("Mongoose Connection", () => {
  let connection;
  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  afterAll(async () => {
    await connection.disconnect();
  });
  it("should connect to successfully", async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
  it("should save a document to the dbs", async () => {
    const user = new Test({ name: "test" });
    await user.save();
    expect(user.isNew).toBe(false);
  });
  it("should find a document from the dbs", async () => {
    const user = await Test.findOne({ name: "test" });
    expect(user).toBeDefined();
    expect(user.name).toBe("test");
  });
});
