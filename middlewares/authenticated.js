"use-strict"
var jwt = require("jwt-simple")
var moment = require("moment")
var secret_key = "clave_secreta_creditas"
// El next es para que no se quede pillado en la peticion HTTP en un middleware
exports.ensureAuth = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message:"La peticion no tiene la cabecera de autorización"})
    }
    //el metodo replace es para quitar las comillas dobles y simples del token
    var token = req.headers.authorization.replace(/['"]+/g,'');
    try{
        var payload = jwt.decode(token,secret_key); 
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:"Token expirado"});
        }
    }
    catch(ex){
        return res.status(404).send({message:"Token no valido"});
    }
    req.user = payload;
    // El next hace que siga el hilo de ejecución hacia el controller
    next();
}