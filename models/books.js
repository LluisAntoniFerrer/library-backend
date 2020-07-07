'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    editorial: {type: Schema.ObjectId, ref: 'Editorial'},
    author: {type: Schema.ObjectId, ref: 'Author'}
})

module.exports = mongoose.model('Book', BookSchema)