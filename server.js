var express = require('express');
var app = express();

var tickers = [
	{ symbol : 'MSFT', name : 'Microsoft Corporation', price : '37.29'},
	{ symbol : 'AAPL', name : 'Apple Inc.', price : '560.09'},
	{ symbol : 'GOOG', name : 'Google Inc.', price : '1118.40'},
	{ symbol : 'AMZN', name : 'Amazon.com Inc.', price : '398.08'},
	{ symbol : 'FB', name : 'Facebook Inc.', price : '55.44'}
];

app.use(express.bodyParser());

// /stock: lists all stock prices (from array)
app.get('/stock', function(req, res) {
	res.json(tickers);
});

// /stock/[symbol]: gets current price for [symbol] (from array)
app.get('/stock/[symbol]', function(req, res) {
	//var s = req.body.symbol;
	res.send('hello world');
	/*tickers.forEach(function() {
		if(tickers.symbol === s) {
			return res.json(tickers.indexOf(s));
		}
		else {
			res.statusCode = 404;
			return res.send('Error 404: Symbol not found');
		}
	});*/

	
});

// /stock/random: lists price from a random stock (from array)
app.get('/stock/random', function(req, res) {
	var id = Math.floor(Math.random() * tickers.length);
	var s = tickers[id];

	res.json(s);
});

// add a stock to the array
app.post('/stock', function(req, res) {
	if(!req.body.hasOwnProperty('symbol') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('price')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newStock = { symbol : req.body.symbol, name : req.body.name, price : req.body.price };

  tickers.push(newStock);
  res.send('New stock added!');
});

// delete a stock from the array
app.delete('stock/[symbol]', function(req, res) {
	var s = req.body.symbol;
	tickers.forEach(function() {
		if(tickers.symbol === s) {
			tickers.splice(req.params.symbol, 1);
			res.send(req.params.symbol + 'sucessfully deleted');
		}
		else {
			res.statusCode = 404;
			return res.send('Error 404: Symbol not found');
		}
	});

	
});

app.listen(process.env.PORT || 3413);