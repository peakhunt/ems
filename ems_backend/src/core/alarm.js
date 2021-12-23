const { EventEmitter } = require('events');
const util = require('util');

const AlarmState = {
  Inactive: 0,
  PendingActive: 1,
  PendingInactive: 2,
  Active: 3,
};

const AlarmStateStr = {
  [AlarmState.Inactive]: 'inactive',
  [AlarmState.PendingActive]: 'pending active',
  [AlarmState.PendingInactive]: 'pending inactive',
  [AlarmState.Active]: 'active',
};

function checkAlarm(alarm, source) {
  //
  // FIXME time delay
  //
  let v = source.value;

  switch(alarm._config.type) {
    case 'high':
      if (v >= alarm._config.set_point) {
        alarm.occur();
      } else {
        alarm.clear();
      }
      break;

    case 'low':
      if (v <= alarm._config.set_point) {
        alarm.occur();
      } else {
        alarm.clear();
      }
      break;

    case 'onoff':
      if (v === alarm._config.set_point) {
        alarm.occur();
      } else {
        alarm.clear();
      }
      break;

    default:
      break;
  }
}

function Alarm(config, source) {
  EventEmitter.call(this);

  this._config = config;
  this._source = source;

  this._state = AlarmState.Inactive;

  this._alarm_time = new Date();

  this._source.on('valueChanged', () => {
    checkAlarm(this, this._source);
  });
}

function moveState(alarm, ns) {
  alarm._state = ns;
}

Alarm.prototype = {
  constructor: Alarm,
  get state() {
    return this._state;
  },
  get source() {
    return this._source;
  },
  get config() {
    return this._config;
  },
  get alarmTime() {
    return this._alarm_time;
  },
  //
  // alarm events
  //
  occur() {
    console.log(`hhhhhhhh ${this._state}`);
    switch (this._state) {
      case AlarmState.Inactive:
        console.log(`hhhhhhhh ${this._state}`);
        this._alarm_time = new Date();
        moveState(this, AlarmState.PendingActive);
        break;

      case AlarmState.PendingInactive:
        moveState(this, AlarmState.PendingActive);
        break;

      case AlarmState.Active:
      case AlarmState.PendingActive:
      default:
        // ignore
        break;
    }
  },
  clear() {
    switch (this._state) {
      case AlarmState.PendingActive:
        moveState(this, AlarmState.PendingInactive);
        break;

      case AlarmState.Active:
        moveState(this, AlarmState.Inactive);
        break;

      case AlarmState.Inactive:
      case AlarmState.PendingInactive:
      default:
        // ignore
        break;
    }
  },
  ack() {
    switch (this._state) {
      case AlarmState.PendingActive:
        moveState(this, AlarmState.Active);
        break;

      case AlarmState.PendingInactive:
        moveState(this, AlarmState.Inactive);
        break;

      case AlarmState.Active:
      case AlarmState.Inactive:
      default:
        // ignore
        break;
    }
  },

  stateStr() {
    return AlarmStateStr[this._state];
  },
};

util.inherits(Alarm, EventEmitter);

function createAlarm(config, source) {
  const alarm = new Alarm(config, source);

  return alarm;
}

module.exports = {
  AlarmState,
  createAlarm,
};
