'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/library')
    .then(() => {
        console.log('Conexión a la base de datos ok')
        app.listen(port, () =>{
            console.log('El servidor esta corriendo')
        });
    })
    .catch(err => console.log(err)) 