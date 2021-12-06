const { version } = require('../../../../package.json');

function info(req, res) {
  const response = {
    version,
    // FIXME rest of the system info
  };

  res.json(response);
}

function info_init(router) {
  router.get('/info', info);
}

module.exports = info_init;
