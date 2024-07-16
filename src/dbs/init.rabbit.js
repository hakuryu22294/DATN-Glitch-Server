const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    if (!connection) throw new Error("RabbitMQ connection failed");
    const chanel = await connection.createChannel();
    return { connection, chanel };
  } catch (err) {
    console.log(err);
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { chanel, connection } = await connectToRabbitMQ();
    const queue = "test_queue";
    const message = "Alo alo ! stfu ! Hello !";
    await chanel.assertQueue(queue);
    await chanel.sendToQueue(queue, Buffer.from(message));
    await connection.close();
  } catch (err) {
    console.log(`Error::: ${err}`);
  }
};

const consumerQueue = async (chanel, queueName) => {
  try {
    await chanel.assertQueue(queueName, { durable: true });
    await chanel.consume(
      queueName,
      (msg) => {
        console.log(
          `Received message: ${queueName} ::`,
          msg.content.toString()
        );
      },
      {
        noAck: true,
      }
    );
  } catch (err) {
    console.log(`Error::: ${err}`);
    throw err;
  }
};

module.exports = { connectToRabbitMQ, connectToRabbitMQForTest, consumerQueue };
