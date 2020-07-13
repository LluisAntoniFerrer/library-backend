'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthorSchema = Schema({
    name:String,
    surname:String,
    country:String,
    role: String
})

module.exports = mongoose.model('Author', AuthorSchema)