const { body, validationResult } = require('express-validator');
const db_api = require('../../../db_api');
const user = require('../../../user');

const ErrorCodes = require('../../../ErrorCodes');
const Capabilities = require('../../../Capabilities');

function get_all_users(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errorCode: ErrorCodes.ErrorProtocol,
    });
  }

  db_api.user_mgmt.get_all_users()
    .then((result) => {
      return res.json(result);
    })
    .catch(() => {
      return res.status(500).json({
        errorCode: ErrorCodes.ErrorDatabase,
      });
    });
}

function add_new_user(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errorCode: ErrorCodes.ErrorProtocol,
    });
  }

  const token = req.headers.authorization;

  if (!user.cap(token, Capabilities.CapUserManagement)) {
    return res.status(403).json({
      errorCode: ErrorCodes.ErrorPrivilege,
    });
  }

  const username = req.body.username;
  const password = req.body.password;
  const capabilities = req.body.capabilities;

  db_api.user_mgmt.add_user(username, password, capabilities)
    .then(() => {
      return res.json({username});
    })
    .catch((errorCode) => {
      return res.status(400).json({
        errorCode,
      });
    });
}

function delete_user(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errorCode: ErrorCodes.ErrorProtocol,
    });
  }

  const token = req.headers.authorization;

  if (!user.cap(token, Capabilities.CapUserManagement)) {
    return res.status(403).json({
      errorCode: ErrorCodes.ErrorPrivilege,
    });
  }

  const username = req.body.username;

  user.delete_user(username)
    .then(() => {
      return res.json({username});
    })
    .catch((errorCode) => {
      return res.status(400).json({
        errorCode,
      });
    });
}

function update_password(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errorCode: ErrorCodes.ErrorProtocol,
    });
  }

  const username = req.body.username;
  const orgPassword = req.body.orgPassword;
  const newPassword = req.body.newPassword;

  user.update_password(username, orgPassword, newPassword)
    .then(() => {
      return res.json({username});
    })
    .catch((errorCode) => {
      return res.status(400).json({
        errorCode,
      });
    });
}

function update_password_for(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errorCode: ErrorCodes.ErrorProtocol,
    });
  }

  const token = req.headers.authorization;

  if (!user.cap(token, Capabilities.CapUserManagement)) {
    return res.status(403).json({
      errorCode: ErrorCodes.ErrorPrivilege,
    });
  }

  const username = req.body.username;
  const password = req.body.password;

  user.update_password_for(username, password)
    .then(() => {
      return res.json({username});
    })
    .catch((errorCode) => {
      return res.status(400).json({
        errorCode,
      });
    });
}

function update_capabilities_for(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errorCode: ErrorCodes.ErrorProtocol,
    });
  }

  const token = req.headers.authorization;

  if (!user.cap(token, Capabilities.CapUserManagement)) {
    return res.status(403).json({
      errorCode: ErrorCodes.ErrorPrivilege,
    });
  }

  const username = req.body.username;
  const capabilities = req.body.capabilities;

  user.update_capabilities_for(username, capabilities)
    .then(() => {
      return res.json({username});
    })
    .catch((errorCode) => {
      return res.status(400).json({
        errorCode,
      });
    });

}

module.exports = (router) => {
  router.get('/get_all_users', get_all_users);

  router.post('/add_new_user', 
    body('username').isString(),
    body('password').isString(),
    body('capabilities').isNumeric(),
    add_new_user);

  router.post('/del_user',
    body('username').isString(),
    delete_user);

  router.post('/update_password',
    body('username').isString(),
    body('orgPassword').isString(),
    body('newPassword').isString(),
    update_password);

  router.post('/update_password_for',
    body('username').isString(),
    body('password').isString(),
    update_password_for);

  router.post('/update_capabilities_for',
    body('username').isString(),
    body('capabilities').isNumeric(),
    update_capabilities_for);
};
