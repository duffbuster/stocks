var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;

var tickers = [{
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: '37.29'
}, {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: '560.09'
}, {
    symbol: 'GOOG',
    name: 'Google Inc.',
    price: '1118.40'
}, {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: '398.08'
}, {
    symbol: 'FB',
    name: 'Facebook Inc.',
    price: '55.44'
}];

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});


// /stock: lists all stock prices (from array)
app.get('/stock', function (req, res) {
    res.json(tickers);
});

// add a stock to the array
app.post('/stock', function (req, res) {
    if (!req.body.hasOwnProperty('symbol') || !req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('price')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    var s = req.body.symbol.toUpperCase();
    var newStock = {
        symbol: s,
        name: req.body.name,
        price: req.body.price
    };

    for (var i = 0; i < tickers.length; i++) {
        if (tickers[i].symbol === s) {
            res.statusCode = 409;
            return res.send('Error 409: Entry already exists');
        }
    }
    tickers.push(newStock);
    res.send('New stock added!');
});

// /stock/random: lists price from a random stock (from array)
app.get('/stock/random/', function (req, res) {
    var id = Math.floor(Math.random() * tickers.length);
    var s = tickers[id];
    res.json(s);
});

// /stock/[symbol]: gets current price for [symbol] (from array)
app.get('/stock/:s', function (req, res) {
    var s = req.params.s.toUpperCase();
    for (var i = 0; i < tickers.length; i++) {
        if (tickers[i].symbol === s) {
            return res.json(tickers[i]);
        }
    }
    res.statusCode = 404;
    return res.send('Error 404: Symbol not found');
});

// delete a stock from the array
app.delete('stock/:s', function (req, res) {
    var s = req.params.s.toUpperCase();

    for (var i = 0; i < tickers.length; i++) {
        if (tickers[i].symbol === s) {
            return res.send('success');
        }
    }
    res.statusCode = 404;
    return res.send('Error 404: Symbol not found');
});

app.listen(process.env.PORT || 3413);