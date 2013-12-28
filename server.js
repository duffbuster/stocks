var express = require('express');
var app = express();

var tickers = [
	{ symbol : 'MSFT', name : 'Microsoft Corporation'},
	{ symbol : 'AAPL', name : 'Apple Inc.'},
	{ symbol : 'GOOG', name : 'Google Inc.'},
	{ symbol : 'AMZN', name : 'Amazon.com Inc.'}
];

app.use(express.bodyParser());

// /stock: lists all stock prices (from array)
app.get('/stock', function(req, res) {

});

// /stock/[symbol]: gets current price for [symbol] (from array)
app.get('/stock/[symbol]', function(req, res) {

});

// /stock/random: lists price from a random stock (from array)
app.get('/stock/random', function(req, res) {

});

// add a stock to the array
app.post('/stock', function(req, res) {
	if(!req.body.hasOwnProperty('symbol') || !req.body.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }
  
});

// delete a stock from the array
app.delete('stock/[symbol]', function(req, res) {

});