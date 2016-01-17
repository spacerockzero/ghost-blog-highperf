if(process.env.NEW_RELIC_LICENSE_KEY) {
  // enable newrelic APM if key exists
  require('newrelic');
}
var path = require('path');
var ghost = require('ghost');

ghost({
  config: path.join(__dirname, 'config.js')
}).then(function (ghostServer) {
  ghostServer.start();
});
