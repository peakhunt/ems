const core = require('../../../core');

function get_current_alarms(req, res) {
  const alarms = core.getAlarmStates();

  return res.json(alarms);
}

module.exports = (router) => {
  router.get('/alarms', get_current_alarms);
};
