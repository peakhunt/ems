const mysql = require('mysql2');
const config = require('../config');
const logger = require('../logger');

const user_mgmt = require('./user_mgmt');
const db_util = require('./db_util');

const pool = mysql.createPool({
  host: 'localhost',
  user: config.emsDB.user,
  password: config.emsDB.password,
  database: config.emsDB.dbName,
  connectionLimit: config.emsDB.maxConnPool,
  queueLimit: config.emsDB.queueLimit,
});

function mysql_init() {
  return new Promise((resolve) => {
    user_mgmt.setup(pool);

    process.nextTick(() => {
      resolve();
    });
  }); 
}

function test() {
  return new Promise((resolve, reject) => {
    db_util.get_db_connection_from_pool(pool)
    .then((conn) => {
      conn.query('select * from test_table', (err, results) => {
        pool.releaseConnection(conn);
        if (err || results.length !== 6 || results[5].num_id !== 5) {
          logger.error(`failed to execute a test db query ${err}, ${results}`);
          return reject();
        }

        let i = 0;

        results.forEach((r) => {
          if (r.num_id !== i) {
            logger.error(`test db value mismatch ${i}, ${r.num_id}`);
            return reject();
          }
          i++;
        });
        return resolve();
      });
    })
    .catch(() => {
      reject();
    });
  });
}

module.exports = {
  init: mysql_init,
  test,
  user_mgmt,
};
