var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Portfolio Tracker' });
});

router.get('/getCurrentCurrencyData/:currencies', function (req, res) {

  if (!req.params.currencies) {
    res.send({
      "error": "Request sent with no parameters."
    });
    console.log("Request sent with no parameters.");
  }

  var currencies = req.params.currencies;

  var request = require('request');
  var currencyData;

  request('http://socket.coincap.io/front', function (err, result, body){
    var json = JSON.parse(body);
    var returnData = [];

    currencyData = json.filter(function(currency) {
      return currencies.includes(currency.short);
    });

    currencyData.forEach(function(curr) {
      var obj = {};
      obj.name = curr.short;
      obj.price = curr.price.toString();

      returnData.push(obj);
    });
    return res.json(returnData);
  });

});

router.get('/getPastCurrencyData/:currencies', function(req, res) {
  if (!req.params.currencies) {
    res.send({
      "error": "Request sent with no parameters."
    });
    console.log("Request sent with no parameters.");
  }

  var currencies = req.params.currencies.split(',');

  var async = require('async');
  var request = require('request');

  function httpGet(urlObject, callback) {
    const options = {
      url: urlObject.url,
      json: true
    };
    request (options,
        function (err, result, body) {
          var json = body;
          var newObj = {};
          newObj.name = urlObject.name;
          newObj.price = '' + json.price.slice(-1)[0][1] + '';
          returnData.push(newObj);
          callback(err, body);
        }
    );
  }

  var urlObjects = [];
  var returnData = [];

  currencies.forEach(function (curr) {
    var newUrl = 'http://socket.coincap.io/history/1day/' + curr;
    var newObj = {};
    newObj.name = curr;
    newObj.url = newUrl;

    urlObjects.push(newObj);
  });

  async.map(urlObjects, httpGet, function (err, result) {
    if (err) return console.log(err);

    return res.send(returnData);

  });
});



module.exports = router;
