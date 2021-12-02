const db_util = require('./db_util');
const logger = require('../logger');

let pool;

function setup(p) {
  pool = p;
}

function log(category, description) {
  db_util.get_db_connection_from_pool(pool)
  .then((conn) => {
    conn.query('insert into ems_event_logs values (NULL, ?, ?, now())', [category, description], (err, results) => {
      pool.releaseConnection(conn);

      if (err) {
        logger.error(`failed to insert event into ems_event_logs ${err}, ${results}`);
      }
    });
  })
  .catch((err) => {
    logger.error(`failed to insert event into ems_event_logs ${err}`);
  });
}

function log_info(description) {
  log('info', description);
}

function log_warning(description) {
  log('warn', description);
}

function log_error(description) {
  log('error', description);
}

function log_query(cond) {
  //
  //  cond : {
  //    start: XXXX-XX-XX xx:xx:xx
  //    end: XXXX-XX-XX xx:xx:xx
  //    category: ['info', 'warn', 'error']
  //  };
  let query = 'select * from ems_event_logs where time >= ? and time <= ?';
  let args = [ cond.start, cond.end];

  if (cond.category.length !== 0) {
    query += ' and ('
    for (let i = 0; i < cond.category.length; i++) {
      query += 'category = ?'
      if (i < cond.category.length -1) query += ' or ';
    }
    query += ')'
    args = args.concat(cond.category);
  }

  return new Promise((resolve, reject) => {
    db_util.get_db_connection_from_pool(pool)
    .then((conn) => {
      conn.query(query, args, (err, results) => {
        pool.releaseConnection(conn);
        if (err) {
          logger.error(`log_query failed ${err}, ${results}`);
          return reject(err);
        }
        return resolve(results);
      });
    })
    .catch((err) => {
      logger.error(`log_query failed ${err}`);
      return reject(err);
    });
  });
}

module.exports = {
  setup,
  log_info,
  log_warning,
  log_error,
  log_query,
};
