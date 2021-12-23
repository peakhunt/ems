const core = require('../core');

function cmdHandlerChannel(client, cmd) {
  if (cmd.length !== 2) {
    client.write('invalid command\r\n');
    client.write(`${cmd[0]} channel-id\r\n`);
    client.write('\r\n');
    return;
  }

  const id = cmd[1];
  const chnl = core.getChannel(id);

  if (chnl === undefined) {
    client.write(`no channel ${id}\r\n`);
    client.write('\r\n');
    return;
  }

  client.write(`id        \t - ${chnl.config.id}\r\n`);
  client.write(`type      \t - ${chnl.config.type}\r\n`);
  client.write(`name      \t - ${chnl.config.name}\r\n`);
  client.write(`value     \t - ${chnl.value}\r\n`);

  client.write('\r\n');
}

function cmdHandlerChannelValue(client, cmd) {
  if (cmd.length !== 3) {
    client.write('invalid command\r\n');
    client.write(`${cmd[0]} id value\r\n`);
    client.write('\r\n');
    return;
  }

  const id = cmd[1];
  const chnl = core.getChannel(id);

  if (chnl === undefined) {
    client.write(`no channel ${id}\r\n`);
    client.write('\r\n');
    return;
  }

  let v;

  if (chnl.config.type === 'digital') {
    v = (cmd[2] === 'true');
  } else {
    v = parseFloat(cmd[2]);
  }
  chnl.value = v;
}

const _commands = {
  channel: {
    desc: 'show channel info',
    handler: cmdHandlerChannel,
  },
  channel_value: {
    desc: 'set channel value',
    handler: cmdHandlerChannelValue,
  },
};

module.exports = _commands;
