const telnet = require('../util/telnet');
const logger = require('../logger');
const cfg = require('../config');

function cmdHandlerHelp(client) {
  // eslint-disable-next-line no-use-before-define
  Object.keys(_commands).forEach((c) => {
    // eslint-disable-next-line no-use-before-define
    client.write(`${c}\t - ${_commands[c].desc}\r\n`);
  });
  client.write('\r\n');
}

const _commands = {
  help: {
    desc: 'show help',
    handler: cmdHandlerHelp,
  },
  version: {
    desc: 'show program version',
    handler: cmdHandlerVersion,
  },
};

function cmdHandlerVersion(client) {
  client.write('Scanjet EMS v0.1\r\n');
  client.write('\r\n');
}

function cliPrompt(client) {
  client.write('EMS CLI>');
}

function executeCLICommand(client, input) {
  logger.info(`executing command |${input}|`);

  const re = /\s+|\t+/;
  const cmd = input.split(re);

  if (cmd[0] === '') {
    return;
  }

  const cmdDef = _commands[cmd[0]];

  if (cmdDef === undefined) {
    client.write(`Unknown command ${cmd[0]}\r\n`);
    return;
  }

  cmdDef.handler(client, cmd);
}

function onClientData(client, b) {
  const str = b.toString('ascii');
  const tClient = client;

  for (let i = 0; i < str.length; i += 1) {
    const c = str.charAt(i);

    if (c === '\r' || c === '\n') {
      // tClient.write('\r\n');

      executeCLICommand(tClient, tClient._ext_cmd);

      cliPrompt(tClient);

      tClient._ext_cmd = '';
    } else {
      tClient._ext_cmd += c;
      // client.write(c);
    }
  }
}

function init() {
  Object.assign(
    _commands
  );

  telnet.createServer((client) => {
    const tClient = client;

    tClient.do.transmit_binary();
    tClient.do.window_size();

    tClient.on('data', (b) => {
      onClientData(tClient, b);
    });

    tClient.write('connected macron CMS CLI\r\n');
    cliPrompt(tClient);

    tClient._ext_cmd = '';
  }).listen(cfg.cli.port);
}

module.exports = {
  init,
};
