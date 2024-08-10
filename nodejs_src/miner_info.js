var https = require('https');

const configfile = '../confidentiel/access.json'
var config = require(configfile)

var workerid = 1234567;

var options = {
  host: 'api2.hiveos.farm',
  path: '/api/v2/farms/' + config.farmid + '/workers/' + workerid,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization' : 'Bearer ' + config.accessToken
  }
};

  var req = https.request(options, function(res) {
    var chunks = [];
    console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });
    res.on("end", function () {
      try {
        var body = chunks.join("");
        //console.log("Body: " + body);
        var miner_info = JSON.parse(body);
        console.log(miner_info);
        // Miner id
        console.log("Miner id: " + miner_info.id);
        // Current power usage
        console.log("Power usage: " + miner_info.octofan_stats.psu.power_ac);
      } catch(e) {

      }
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    reject(error);
  });

  req.end();
  // Be carefull, here, the result is not ready

