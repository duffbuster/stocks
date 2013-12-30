var express = require('express');
var app = express();
var mongoose = reqire('mongoose');
var random = require('mongoose-random');

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

var stock = new mongoose.Schema({
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

stock.plugin(random);

var stockModel = mongoose.model('stockModel', stock);

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
    return stockModel.findRandom(function (err, stock) {
        if (err) throw err;
        console.log(stock);
    });
});

// UPDATE a stock by symbol
app.put('/stock/:s', function (req, res) {
    var symbol = req.params.s.toUpperCase();
    return stockModel.findOne({
        'symbol': symbol
    }, function (err, stock) {
        stock.symbol = req.body.symbol.toUpperCase();
        stock.name = req.body.name;
        stock.price = req.body.price;
        return stock.save(function (err) {
            if (!err)
                console.log("updated");
            else
                console.log(err);
            return res.send(stock);
        });
    });
});

// /stock/[symbol]: gets current price for [symbol] (from database)
app.get('/stock/:s', function (req, res) {
    var symbol = req.params.s;
    return stockModel.findOne({
        'symbol': symbol
    }, function (err, stock) {
        if (!err)
            return res.json(stock);
        else
            return console.log(err);
    });
});

// delete a stock from the database
app.delete('stock/:s', function (req, res) {
    var symbol = req.params.s.toUpperCase();
    return stockModel.findOne({
        'symbol': symbol
    }, function (err, stock) {
        return stock.remove(function (err) {
            if (!err) {
                console.log('removed');
                return res.send('');
            } else
                console.log(err);
        });
    });
});

app.listen(process.env.PORT || 3413);