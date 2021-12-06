const { EventEmitter } = require('events');
const util = require('util');

const AlarmState = {
  Inactive: 0,
  PendingActive: 1,
  PendingInactive: 2,
  Active: 3,
};

function Alarm(config, source) {
  /*
    config : {
      id: XXX,
      name: 'XXX',
      severity: XXX,
    }
  */
  EventEmitter.call(this);

  this._config = config;

  this._source = source;
  this._source.on('valueChange', () => {
  });

  this._state = AlarmState.Inactive;
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
  //
  // alarm events
  //
  occur() {
    switch (this._stsate) {
      case AlarmState.Inactive:
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
    switch (this._stsate) {
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
    switch (this._stsate) {
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
