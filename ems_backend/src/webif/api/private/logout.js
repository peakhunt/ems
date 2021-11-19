const { validationResult } = require('express-validator');
const user = require('../../../user');

function logout(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const token = req.headers.authorization;

  //
  // we don't care about the result
  //
  user.logout(token);

  return res.json({
  });
}

module.exports = (router) => {
  router.post('/logout', logout);
};
