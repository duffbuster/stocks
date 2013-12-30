var express = require('express');
var app = express();
var mongoose = require('mongoose');
var random = require('mongoose-random');

//require('express-mongoose');

//var models = require('./models');
//var routes = require('./routes');
//var middleware = require('./middleware');

mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/tickers');

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

var schema = new mongoose.Schema({
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

schema.plugin(random);

var stockModel = mongoose.model('stockModel', schema);

// /stock: lists all stock prices (from database)
// working
app.get('/stock', function (req, res) {
    return stockModel.find(function (err, stocks) {
        if (!err)
            return res.send(stocks);
        else
            return console.log(err);
    });
});

// add a stock to the database
// working
app.post('/stock', function (req, res) {
    var stock;
    console.log("POST: ");
    console.log(req.body);
    stock = new stockModel({
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
app.get('/stocks/random', function (req, res) {
    return stockModel.count(function (err, count) {
        if (err)
            console.log(err);
        var rand = Math.floor(Math.random() * count);
        return res.send(stockModel.findOne().skip(rand));
    });
});

// UPDATE a stock by symbol
// working
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
// working
app.get('/stock/:s', function (req, res) {
    var symbol = req.params.s.toUpperCase();
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