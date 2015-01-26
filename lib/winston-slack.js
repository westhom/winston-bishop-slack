var util = require('util')
  , winston = require('winston')
  , superagent = require('superagent')
  , extend = require('extend.js')

var Slack = exports.Slack = function (options) {
  options = options || {};
  if(!options.webhook_url) {
      throw new Error("webhook url cannot be null");
  }
  else {
      this.webhook_url     = options.webhook_url;
      this.level           = options.level    || 'info';
      this.silent          = options.silent   || false;
      this.raw             = options.raw      || false;
      this.customFormatter = options.customFormatter;

      //- Enabled loging of uncaught exceptions
      this.handleExceptions = options.handleExceptions || false
  }
}

util.inherits(Slack, winston.Transport);
winston.transports.Slack = Slack;
Slack.prototype.name = 'slack'

Slack.prototype.log = function (level, msg, meta, callback) {
  //- Use custom formatter for message if set
  var message = this.customFormatter
    ? this.customFormatter(level, msg, meta)
    : { text: util.format("[%s] %s", level.toUpperCase(), msg) }

  superagent
      .post(this.webhook_url)
      .send(message)
      .end(callback)
};