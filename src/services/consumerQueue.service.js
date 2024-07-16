const { consumerQueue, connectToRabbitMQ } = require("../dbs/init.rabbit");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { chanel, connection } = await connectToRabbitMQ();
      await consumerQueue(chanel, queueName);
    } catch (err) {
      console.log(`Error consuming queue::: ${err}`);
    }
  },
  //case processing
};

module.exports = messageService;
