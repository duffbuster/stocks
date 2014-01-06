var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('./config-debug');

describe('Routing', function () {
    var url = 'http://localhost:3413';
    before(function (done) {
        mongoose.connect(config.db.mongodb);
        done();
    });
    describe('Stocks', function () {
        it('should correctly add a stock to the db', function (done) {
            var newStock = {
                symbol: 'TWTR',
                name: 'Twitter Inc.',
                price: 64.91
            };
            request(url)
                .post('/stock')
                .send(newStock)
            // end handles the response
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                // this is should.js syntax, very clear
                res.should.have.status(200);
                done();
            });
        });
        it('should return error trying to save duplicate stock', function (done) {
            var newStock = {
                symbol: 'FB',
                name: 'Facebook Inc.',
                price: 55.44
            };
            request(url)
                .post('/stock')
                .send(newStock)
            // end handles the response
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                // this is should.js syntax, very clear
                res.should.have.status(400);
                done();
            });
        });
        it('should correctly update an existing account', function (done) {
            var update = {
                symbol: 'XOM',
                name: 'Exxon Mobile Corporation',
                price: 99.06
            };
            request(url)
                .put('/stock/xom')
                .send(update)
                .expect('Content-Type', /json/)
                .expect(200) //Status code
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                // Should.js fluent syntax applied
                res.body.should.have.property('_id');
                res.body.symbol.should.equal('XOM');
                res.body.price.should.equal(99.06);
                res.body.creationDate.should.not.equal(null);
                done();
            });
        });
    });
});