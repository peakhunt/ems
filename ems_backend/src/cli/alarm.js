const core = require('../core');

function cmdHandlerAlarm(client, cmd) {
  if (cmd.length !== 2) {
    client.write('invalid command\r\n');
    client.write(`${cmd[0]} dalarm-id\r\n`);
    client.write('\r\n');
    return;
  }

  const id = cmd[1];
  const alarm = core.getAlarm(id);

  if (alarm === undefined) {
    client.write(`no alarm ${id}\r\n`);
    client.write('\r\n');
    return;
  }

  client.write(`id        \t - ${alarm.config.id}\r\n`);
  client.write(`name      \t - ${alarm.config.name}\r\n`);
  client.write(`channel   \t - ${alarm.config.channel}\r\n`);
  client.write(`type      \t - ${alarm.config.type}\r\n`);
  client.write(`set_point \t - ${alarm.config.set_point}\r\n`);
  client.write(`delay     \t - ${alarm.config.delay}\r\n`);
  client.write(`severity  \t - ${alarm.config.severity}\r\n`);
  client.write(`state     \t - ${alarm.stateStr()}\r\n`);
  client.write(`time      \t - ${core.toDateTimeStr(alarm.alarmTime)}\r\n`);
}

const _commands = {
  alarm: {
    desc: 'show alarm info',
    handler: cmdHandlerAlarm,
  },
};

module.exports = _commands;
