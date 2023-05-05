const redis = require("redis");
const config = require("./config");
const { promisifyAll } = require("bluebird");

promisifyAll(redis);

const cacheClient = redis.createClient({
  url: `redis://${config.redis.host}:${config.redis.port}/${config.redis.db}`,
});

const connectCache = async () => {
  await cacheClient.connect();

  cacheClient.on("error", (err) => {
    console.error(err);
  });

  cacheClient.on("connect", () => {
    console.info(`Redis Connected! ${host}:${port}, db: ${db}`);
  });
};

module.exports.connectCache = connectCache;
module.exports.cacheClient = cacheClient;
