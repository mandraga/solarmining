/**
 * Give an object array containing all the miners on the farm
 */
var https = require('https');

const configfile = '../confidentiel/access.json'

var config = require(configfile)

console.log(config);

var options = {
  host: 'api2.hiveos.farm',
  path: '/api/v2/farms/' + config.farmid + '/workers/preview',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization' : 'Bearer ' + config.accessToken
  }
};

console.log(options.path);

var req = https.request(options, function(res) {
  var chunks = [];
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    //console.log(chunk);
    chunks.push(chunk);
  });
  res.on("end", function () {
    try {
      var body = chunks.join("");
      //console.log("Body: " + body);
      var miner_list = JSON.parse(body);
      console.log("Miner number: " + miner_list.data.length);
      console.log(miner_list);
      for (var i = 0; i < miner_list.data.length; i++) {
        console.log(miner_list.data[i].stats);
      }
    } catch(e) {
      console.log("Request error");
    }
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();
