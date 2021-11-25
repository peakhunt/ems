const express = require('express');
const bodyParser = require('body-parser');
const logger = require('../logger');
const config = require('../config');

const api = require('./api');

function webintf_init() {
  return new Promise((resolve, reject) => {
    let port;

    logger.info("initializing web interface");

    const app = express();

    app.use(express.static('public'));
    app.get('/', (req, res) => {
      res.sendfile('public/index.html');
    });

    port = config.web.port;

    /* istanbul ignore if  */
    /* istanbul ignore else */
    if (config.devMode.enabled === true) {
      /* istanbul ignore next: not easy to test this part. no need to either */
      logger.warn(`running in dev mode using port ${config.web.devPort}`);
      /* istanbul ignore next: not easy to test this part. no need to either */
      port = config.web.devPort;
    }


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.text());
    app.use(bodyParser.json({ type: 'application/json' }));

    api(app);

    const listener = app.listen(port, () => {
        logger.info(`EMS Web Server listening on port ${port}!`)
        resolve({ app, listener });
      })
      .on('error', () => {
        logger.info(`EMS Web Server failed to listen on ${port}!`)
        reject();
      });
  });
}

module.exports = webintf_init;
