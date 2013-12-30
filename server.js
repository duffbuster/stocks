var express = require('express');
var app = express();
var mongoose = reqire('mongoose');

require('express-mongoose');

var models = require('./models');
var routes = require('./routes');
var middleware = require('./middleware');

mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/tickers');

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

var schema = mongoose.Schema;

var stock = new Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

var stockModel = mongoose.model('stock', stock);

// /stock: lists all stock prices (from database)
app.get('/stock', function (req, res) {
    return stockModel.find(function (err, stocks) {
        if (!err)
            return res.send(stocks);
        else
            return console.log(err);
    });
});

// add a stock to the database
app.post('/stock', function (req, res) {
    var stock;
    console.log("POST: ");
    console.log(req.body);
    product = new stockModel({
        symbol: req.body.symbol.toUpperCase(),
        name: req.body.name,
        price: req.body.price
    });
    stock.save(function (err) {
        if (!err)
            return console.log("Created");
        else
            return console.log(err);
    });
    return res.send(stock);
});

// /stock/random: lists price from a random stock (from database)
app.get('/stock/random/', function (req, res) {
    var id = Math.floor(Math.random() * tickers.length);
    var s = tickers[id];
    res.json(s);
});

// UPDATE a stock by ID
app.put('/stock/:s', function (req, res) {
    return stockModel.findById(req.params.s, function(err, stock) {
        stock.symbol = req.body.symbol.toUpperCase();
        stock.name = req.body.name;
        stock.price = req.body.price;
        return stock.save(function(err) {
            if(!err)
                console.log("updated");
            else
                console.log(err);
            return res.send(stock);
        });
    });
});

// /stock/[symbol]: gets current price for [symbol] (from database)
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

// delete a stock from the database
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