const { query, validationResult } = require('express-validator');
const db_api = require('../../../db_api');
const ErrorCodes = require('../../../ErrorCodes');

function get_event_logs(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errorCode: ErrorCodes.ErrorProtocol,
    });
  }

  db_api.event_log.log_query( {
    start: req.query.start,
    end: req.query.end,
    category: req.query.category,
  })
  .then((result) => {
    return res.json(result);
  })
  .catch(() => {
    return res.status(500).json({ 
      errorCode: ErrorCodes.ErrorDatabase,
    });
  });
}

module.exports = (router) => {
  router.get('/event_logs',
    query('start').isString(),
    query('end').isString(),
    query('category').isArray(),
    get_event_logs);
};
