const logger = require('../logger');
const config = require('../config');

function get_db_connection_from_pool(pool) {
  let caller = "";

  if (config.devMode.enabled == true) {
    caller = (new Error().stack.split("at ")[2]).trim();
  }

  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if(err) {
        logger.error(`get_db_connection_from_pool failed. called from ${caller}`);
        return reject();
      }
      resolve(conn);
    });
  });
}

module.exports = {
  get_db_connection_from_pool,
};
