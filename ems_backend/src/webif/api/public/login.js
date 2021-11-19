const { body, validationResult } = require('express-validator');
const user = require('../../../user');

const ErrorCodes = require('../../../ErrorCodes');

function login(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errorCode: ErrorCodes.ErrorProtocol,
    });
  }

  const username = req.body.username;
  const password = req.body.password;

  user.login(username, password)
  .then((result) => {
    res.json(result);
  })
  .catch((errorCode) => {
    return res.status(401).json({
      errorCode,
    });
  });
}

module.exports = (router) => {
  router.post('/login',
    body('username').isString(),
    body('password').isString()
  , login);
};
