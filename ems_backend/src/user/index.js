const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config');
const logger = require('../logger');
const db_api = require('../db_api');

const ErrorCodes = require('../ErrorCodes');

const users_by_token = {
};

function login_user(user) {
  logger.info(`${user.username} logged in`);

  const secret = config.user_mgmt.super_secret;
  const uinfo = {
    username: user.username,
    access_time: moment()
  };

  const token = jwt.sign(uinfo, secret);

  users_by_token[token] = {
    info: {
      username: user.username,
      capabilities: user.capabilities,
    },
    access_time: moment(),
    token,
  };

  return token;
}

function login(username, password) {
  return new Promise((resolve, reject) => {
    if (username === null || username === undefined || password === null || password === undefined) {
      process.nextTick(() => {
        reject(ErrorCodes.ErrorProtocol);
      });
    }

    db_api.user_mgmt.get_user(username)
    .then((results) => {
      if (results.length !== 1 || results[0].password !== password)  {
        logger.info(`${username} failed to login`);
        return reject(ErrorCodes.ErrorLoginIDPassword);
      }

      // success
      const user = {
        username: results[0].username, 
        password: results[0].password,
        capabilities: results[0].capabilities,
      }

      resolve({
        token: login_user(user),
        info: {
          username,
          admin: results[0].admin,
          capabilities: results[0].capabilities,
        }
      });
    })
    .catch((err) => {
      logger.error(`user.login() error ${err}`);
      reject(ErrorCodes.ErrorDatabase);
    });
  });
}

function logout(token) {
  const uinfo = users_by_token[token];

  if (uinfo === undefined) {
    logger.debug(`logging out ${token} is not logged in`);
    return;
  }

  delete users_by_token[token];
  logger.info(`${uinfo.info.username} logged out`);
}

function logout_by_username(username) {
  let tokens = [];

  for (const [key, value] of Object.entries(users_by_token)) {
    if (value.info.username === username) {
      tokens.push(key);
    }
  }

  tokens.forEach((token) => {
    logout(token);
  });
}


function authorize(token) {
  const uinfo = users_by_token[token];

  if (uinfo === undefined) {
    logger.debug(`${token} not authorized`);
    return false;
  }

  if (uinfo.token !== token) {
    logger.warn(`token mismatch for ${token}`);
    return false;
  }

  const now = moment();

  if (config.user_mgmt.timeout_in_secs !== 0) {
    const timeout = config.user_mgmt.timeout_in_secs;
    const diff = now.diff(uinfo.access_time, 'seconds');

    if (diff > timeout) {
      logger.debug(`${token} timedout`);
      logout(token);
      return false;
    }
  }

  uinfo.access_time = now;

  return true;
}

function delete_user(username) {
  return new Promise((resolve, reject) => {
    db_api.user_mgmt.delete_user(username)
      .then(() => {
        logout_by_username(username);
        return resolve();
      })
      .catch((errorCode) => {
        return reject(errorCode);
      });
  });
}

function update_password(username, orgPassword, newPassword) {
  return new Promise((resolve, reject) => {
    db_api.user_mgmt.get_user(username)
      .then((result) => {
        if (result.length !== 1 || result[0].password !== orgPassword) {
          return reject(ErrorCodes.ErrorLoginIDPassword);
        }
        return db_api.user_mgmt.change_user(username, newPassword, result[0].capabilities);
      })
      .then(() => {
        resolve();
      })
      .catch(() => {
        return reject(ErrorCodes.ErrorDatabase);
      });
  });
}

function update_password_for(username, password) {
  return new Promise((resolve, reject) => {
    db_api.user_mgmt.get_user(username)
      .then((result) => {
        if (result.length !== 1) {
          return reject(ErrorCodes.ErrorLoginIDPassword);
        }
        return db_api.user_mgmt.change_user(username, password, result[0].capabilities);
      })
      .then(() => {
        resolve();
      })
      .catch(() => {
        return reject(ErrorCodes.ErrorDatabase);
      });
  });
}

function update_capabilities_for(username, capabilities) {
  return new Promise((resolve, reject) => {
    db_api.user_mgmt.get_user(username)
      .then((result) => {
        if (result.length !== 1) {
          return reject(ErrorCodes.ErrorLoginIDPassword);
        }
        return db_api.user_mgmt.change_user(username, result[0].password, capabilities);
      })
      .then(() => {
        resolve();
      })
      .catch(() => {
        return reject(ErrorCodes.ErrorDatabase);
      });
  });
}

function cap(token, req) {
  const user = users_by_token[token];

  if (user === undefined) {
    logger.debug(`cap ${token} not found`);
    return false;
  }

  const u32 = new Uint32Array(1);

  u32[0] = (user.info.capabilities >>> 0);

  return (u32[0] & (req >>> 0)) !== 0;
}

module.exports = {
  login,
  logout,
  logout_by_username,
  authorize,
  cap,
  delete_user,
  update_password,
  update_password_for,
  update_capabilities_for,
};
