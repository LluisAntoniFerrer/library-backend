'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas

//middelwares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configurar cabeceras y cors

//rutas body-parser
app.get('/probando', (req, res) =>{
    res.status(200).send({message: 'prueba 1'})
})
module.exports = app;