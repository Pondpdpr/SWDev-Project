const redis = require("redis");
const config = require("./config");
const { promisifyAll } = require("bluebird");

promisifyAll(redis);

const cacheClient = redis.createClient({
  database: config.redis.db,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

const connectCache = async () => {
  await cacheClient.connect();

  cacheClient.on("error", function (error) {
    console.error(error);
  });

  cacheClient.on("connect", function () {
    console.info(`Redis Connected! ${host}:${port}, db: ${db}`);
  });
};

module.exports.connectCache = connectCache;
module.exports.cacheClient = cacheClient;
