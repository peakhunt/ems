require("dotenv").config();

const web_if = require('./webif');
const logger = require("./logger");
const dbAPI = require('./db_api');

logger.info("starting EMS server");
dbAPI.init()
.then(() => {
  logger.info("connected to database. testing db connection");
  return dbAPI.test();
})
.then(() => {
  logger.info("testing db connection success. initializing web interface");
  return web_if();
})
.then(() => {
  logger.info("EMS Server. Startup Complete!");
})
.catch(() => {
  logger.error("EMS Server. startup failed. Aborting!");
  process.exit(-1);
});
