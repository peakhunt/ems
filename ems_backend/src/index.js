// require("fix-esm").register();
require("dotenv").config();

const web_if = require('./webif');
const logger = require("./logger");
const dbAPI = require('./db_api');
const core = require('./core');
const cli = require('./cli');

logger.info("starting EMS server");
dbAPI.init()
.then(() => {
  logger.info("connected to database. testing db connection");
  return dbAPI.test();
})
.then(() => {
  logger.info("testing db connection success. initializing core");
  return core.init();
})
.then(() => {
  logger.info("core initialized. initializing web interface");
  return web_if();
})
.then(() => {
  logger.info("web interface initialized. starting up CLI");
  cli.init();
  logger.info("EMS Server. Startup Complete!");
  dbAPI.event_log.log_info("EMS Server. Startup Complete!");
  dbAPI.event_log.log_warning("Sample warning event!");
  dbAPI.event_log.log_error("Sample error event!");
})
.catch((e) => {
  logger.error(`EMS Server. startup failed. Aborting! ${e}`);
  process.exit(-1);
});
