'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    reference:Number,
    publisher: {type: Schema.ObjectId, ref: 'Publisher'},
    author: {type: Schema.ObjectId, ref: 'Author'}
})

module.exports = mongoose.model('Book', BookSchema)