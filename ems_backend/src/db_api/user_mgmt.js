const db_util = require('./db_util');
const ErrorCodes = require('../ErrorCodes');
// const logger = require('../logger');

let pool;

function setup(p) {
  pool = p;
}

function get_all_users() {
  return new Promise((resolve, reject) => {
    db_util.get_db_connection_from_pool(pool)
    .then((conn) => {
      conn.query('select * from ems_users', (err, results) => {
        pool.releaseConnection(conn);
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    })
    .catch(() => {
      return reject();
    });
  });
}

function get_user(username) {
  return new Promise((resolve, reject) => {
    db_util.get_db_connection_from_pool(pool)
    .then((conn) => {
      conn.query(`select * from ems_users where username = ?`, [username], (err, results) => {
        pool.releaseConnection(conn);
        if (err) return reject(err);

        return resolve(results);
      });
    })
    .catch((err) => {
      return reject(err);
    });
  });
}

function add_user(username, password, capabilities) {
  return new Promise((resolve, reject) => {
    db_util.get_db_connection_from_pool(pool)
    .then((conn) => {
      conn.query(`insert into ems_users values (?, ?, ?, ?)`, [username, password, false, capabilities], (err, results) => {
        pool.releaseConnection(conn);
        if (err) return reject(ErrorCodes.ErrorUserAlreadyExist);

        return resolve(results);
      });
    })
    .catch(() => {
      return reject(ErrorCodes.ErrorDatabase);
    });
  });
}

function delete_user(username) {
  return new Promise((resolve, reject) => {
    db_util.get_db_connection_from_pool(pool)
    .then((conn) => {
      conn.query(`delete from ems_users where username = ?`, [username], (err, results) => {
        pool.releaseConnection(conn);
        if (err) return reject(ErrorCodes.ErrorDatabase);

        return resolve(results);
      });
    })
    .catch(() => {
      return reject(ErrorCodes.ErrorDatabase);
    });
  });
}

function change_user(username, password, capabilities) {
  return new Promise((resolve, reject) => {
    db_util.get_db_connection_from_pool(pool)
    .then((conn) => {
      conn.query(`update ems_users set password = ?, capabilities = ? where username = ?`,
        [password, capabilities, username], (err, results) => {
        pool.releaseConnection(conn);
        if (err) return reject(ErrorCodes.ErrorDatabase);

        return resolve(results);
      });
    })
    .catch(() => {
      return reject(ErrorCodes.ErrorDatabase);
    });
  });
}

module.exports = {
  setup,
  get_all_users,
  get_user,
  add_user,
  delete_user,
  change_user,
}
