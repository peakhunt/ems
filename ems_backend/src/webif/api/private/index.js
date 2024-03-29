const user = require('../../../user');
const hello = require('./hello');
const logout = require('./logout');
const user_mgmt = require('./user_mgmt');
const event_log = require('./event_log');
const info = require('./info');
const alarms = require('./alarms');

function authorize(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No credentials sent!' });
  }

  const token = req.headers.authorization;

  if (user.authorize(token) === false) {
    return res.status(401).json({ error: 'Unauthorized!' });
  }

  return next();
}

function private_api_init(router) {
  router.use(authorize);

  hello(router);
  logout(router);
  user_mgmt(router);
  event_log(router);
  info(router);
  alarms(router);
}

module.exports = private_api_init;
