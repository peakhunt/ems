const { EventEmitter } = require('events');
const util = require('util');

function Channel(config) {
  EventEmitter.call(this);

  this._config = config;

  switch(this._config.type) {
    case 'digital':
      this._value = false;
      break;

    default:
      this._value = 0;
      break;
  }
}

Channel.prototype = {
  constructor: Channel,
  get value() {
    return this._value;
  },
  set value(v) {
    this._value = v;
    this.emit('valueChanged', this);
  },
  get config() {
    return this._config;
  },
};

util.inherits(Channel, EventEmitter);

function createChannel(config) {
  const channel = new Channel(config);

  return channel;
}

module.exports = {
  createChannel,
};
