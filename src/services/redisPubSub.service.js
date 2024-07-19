const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subcriber = Redis.createClient();
    this.publish = Redis.createClient();
  }
  publish(chanel, message) {
    return new Promise((resolve, reject) => {
      this.publish(chanel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(chanel, callback) {
    this.subcriber.subscribe(chanel);
    this.subcriber.on("message", (subcriberChanel, message) => {
      if (chanel === subcriberChanel) {
        callback(chanel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
