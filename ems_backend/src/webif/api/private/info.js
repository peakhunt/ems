const { version } = require('../../../../package.json');
const project = require('../../../project');

function info(req, res) {
  const response = {
    version,
    project,
  };

  res.json(response);
}

function info_init(router) {
  router.get('/info', info);
}

module.exports = info_init;
