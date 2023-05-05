const redis = require("redis");
const { promisifyAll } = require("bluebird");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

promisifyAll(redis);

const host = process.env.REDIS_HOST || "localhost";
const port = process.env.REDIS_PORT || 6379;
const db = process.env.REDIS_DB || 0;

const cacheClient = redis.createClient({
  host,
  port,
  db,
});

module.exports.connectCache = async () => {
  await cacheClient.connect();

  cacheClient.on("error", function (error) {
    console.error(error);
  });

  cacheClient.on("connect", function () {
    console.info(`Redis Connected! ${host}:${port}, db: ${db}`);
  });
};

module.exports.cacheClient = cacheClient;
