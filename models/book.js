'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    reference:Number,
    // publisher: {type: Schema.ObjectId, ref: 'Publisher'},
    user_author: {type: Schema.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Book', BookSchema)