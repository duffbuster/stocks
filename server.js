var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./Config-debug');
var http = require('http');
var yql_url = "http://query.yahooapis.com/v1/public/yql";


require('express-mongoose');

mongoose.set('debug', true);

mongoose.connect(config.db.mongodb);

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

var stockModel = mongoose.model('stockModel', schema);
// /stock: lists all stock prices (from database)
// working
app.get('/stock', function (req, res) {
    return stockModel.find(function (err, stocks) {
        if (!err)
            return res.json(stocks);
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
    stockModel.findOne({
        'symbol': stock.symbol
    }, function (err, stock) {
        if (!err) {
            res.statusCode = 400;
            return console.log("Entry already exists");
        }
    });
    stock.save(function (err) {
        if (!err)
            return console.log("Created");
        else
            return console.log(err);
    });
    return res.send(stock);
});

app.put('/stock', function (req, res) {
    var dbSymbols;

    // get stocks from the db
    stockModel.find(function (err, stocks) {
        if (err)
            return console.log(err);
        else {
            stocks.forEach(function (stock) {
                dbSymbols.concat('"' + stock.symbol + '",');
            });
            findUpdates(dbSymbols);
        }
    });

    var findUpdates = function (symbols) {
        // assemble the yql url
        var stockSymbols = symbols.slice(',', -1);
        var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in (" + stockSymbols + ")");

        // parse out the live prices
        http.get(yql_url + "?q=" + data + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json", function (result) {
            console.log("Got response: " + res.statusCode);
            var body = "";
            result.on("data", function (chunk) {
                body += chunk;
            });
            result.on("end", function () {
                var bodyObject = JSON.parse(body);
                var totalReturned = bodyObject.query.count;
                for (var i = 0; i < totalReturned; i++) {
                    var upStock = bodyObject.query.results.quote[i];
                    update(upStock.symbol, upStock.Ask);
                }
            });
        }).on('error', function (e) {
            return console.log("Got error: " + e.message);
        });
    };


    // update the database
    var update = function (symbol, price) {
        stockModel.findOne({
            'symbol': symbol
        }, function (err, stock) {
            stock.symbol = symbol;
            stock.price = price;
            stock.save(function (err) {
                if (!err)
                    console.log(symbol + " updated");
                else
                    return console.log(err);
                res.send(stock);
            });
        });
    };
});

// /stock/random: lists price from a random stock (from database)
app.get('/stocks/random', function (req, res) {
    stockModel.count(function (err, count) {
        if (err) {
            console.log(err);
            res.send(500);
            return;
        }

        var rand = Math.floor(Math.random() * count);

        stockModel.find({}, {}, {
            skip: rand,
            limit: 1
        }, function (subErr, result) {
            if (subErr) {
                res.send(500);
                return;
            }

            res.json(result); // probably an array, but should have a random result.
        });
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