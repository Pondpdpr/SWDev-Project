const redis = require("redis");
const config = require("./config");
const { promisifyAll } = require("bluebird");

promisifyAll(redis);

class Redis {
  static cacheClient;

  static {
    Redis.cacheClient = redis.createClient({
      database: config.redis.db,
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
    });
    console.debug(
      `redis config hostname=${config.redis.host}:${config.redis.port}, db=${config.redis.db}`
    );
  }

  static connectCache = async () => {
    await Redis.cacheClient.connect();

    Redis.cacheClient.on("error", function (error) {
      console.error(error);
    });

    Redis.cacheClient.on("connect", function () {
      console.info(`Redis Connected! ${host}:${port}, db: ${db}`);
    });
  };
}

module.exports.connectCache = Redis.connectCache;
module.exports.cacheClient = Redis.cacheClient;
