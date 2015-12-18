module.exports = function(req, res, next) {
  var fs = require('fs')
  fs.readFile('./service-worker.js', 'utf8', function(serviceWorker){
    res.send(serviceWorker)
  })
}
