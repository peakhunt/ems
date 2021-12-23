const { body, validationResult } = require('express-validator');
const ErrorCodes = require('../../../ErrorCodes');
const core = require('../../../core');

function get_current_alarms(req, res) {
  const alarms = core.getAlarmStates();

  return res.json(alarms);
}

function alarm_ack(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errorCode: ErrorCodes.ErrorProtocol,
    });
  }

  const id = req.body.id;

  const alarm = core.ackAlarm(id);

  return res.json({
    id,
    state: alarm.state
  });
}

module.exports = (router) => {
  router.get('/alarms', get_current_alarms);
  router.post('/alarm_ack',
    body('id').isString(),
    alarm_ack);
};
