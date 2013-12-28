var express = require('express');
var app = express();

var tickers = [
	{ symbol : 'MSFT', name : 'Microsoft Corporation'},
	{ symbol : 'AAPL', name : 'Apple Inc.'},
	{ symbol : 'GOOG', name : 'Google Inc.'},
	{ symbol : 'AMZN', name : 'Amazon.com Inc.'}
];

app.use(express.bodyParser());

// /stock

// /stock/[symbol]

// /stock/random