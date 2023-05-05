const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

module.exports = {
  app: {
    port: process.env.PORT || 8000,
    env: process.env.NODE_ENV || "developement",
    hotelCacheTTL: process.env.HOTEL_CACHE_TTL || 9000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expire: process.env.JWT_EXPIRE || "30d",
    cookieExpire: process.env.JWT_COOKIE_EXPIRE || "30",
  },
  mongodb: {
    uri: process.env.MONGO_URI || "",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0,
  },
};
