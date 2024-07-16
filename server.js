const { consumerToQueue } = require("./src/services/consumerQueue.service");

const queueName = "test_queue";

consumerToQueue(queueName)
  .then(() => {
    console.log(`Message consumer started::: ${queueName}`);
  })
  .catch((err) => {
    console.log(`Message Error::: ${err}`);
  });
