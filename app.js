'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require("./routes/user");
var book_routes = require("./routes/book");
//middelwares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configurar cabeceras y cors

//rutas base
app.use("/api", user_routes);
app.use("/api", book_routes);

app.get('/probando', (req, res) =>{
    res.status(200).send({message: 'prueba 1'})
})
app.get("/saludo",(req,res)=>{
    res.status(200).send("hola mundo")
})
module.exports = app;