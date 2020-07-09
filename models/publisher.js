'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublisherSchema = Schema({
    name:String,
    city:String,
})

module.exports = mongoose.model('Publisher', PublisherSchema)