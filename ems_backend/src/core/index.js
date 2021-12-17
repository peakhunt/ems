// const logger = require("../logger");
const project = require('./project');
const Channel = require('./channel');
const Alarm = require('./alarm');

const _channels = {
};

const _alarms = {
};

function init() {
  return new Promise((resolve, reject) => {
    try {
      project.channels.forEach((config) => {
        if (_channels[config.id] !== undefined) {
          throw `channel id ${config.id} already exists`;
        }

        let chnl;
        chnl = Channel.createChannel(config);

        _channels[config.id] = chnl;
      });
    } catch(e) {
      return reject(e);
    }

    try {
      project.alarms.forEach((config) => {
        if (_alarms[config.id] !== undefined) {
          throw  `alarm id ${config.id} already exists`;
        }

        if (_channels[config.channel] === undefined) {
          throw `channel ${config.channel} for alarm ${config.id} doesn't  exist`;
        }

        let alarm, channel;
        
        channel = _channels[config.channel];
        alarm = Alarm.createAlarm(config, channel);

        _alarms[config.id] = alarm;
      });
    } catch(e) {
      return reject(e);
    }
    resolve();
  });
}

module.exports = {
  init,
};
