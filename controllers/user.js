"use-strict"
//modulos
var bcrypt = require("bcrypt-nodejs")
//modelos
var User = require("../models/user")
//acciones
function pruebas(req,res){
    res.status(200).send({message:"probando el controllador de usuarios y la accion pruebas"
});
}

function saveUser(req,res){
    //Crear objeto del modelo Usuario
    var user = new User()

    //Recoger parametros de la petición, el body
    var params = req.body

    if(params.password && params.name && params.surname && params.email){
            //Assignar valores al objeto Usuario
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email;
            user.role = "ROLE_USER";
            //Cifrar el password
            bcrypt.hash(params.password, null,null, function(err,hash){
                user.password = hash;
                //Guardar user en BBDD
                user.save((err,userStored)=>{
                    if(err){
                        res.status(500).send({message:"Error al guardar el usuario"});
                    }
                    else{
                        if(!userStored){
                            res.status(404).send({message:"No se registró el usuario"});
                        }
                        else{
                            res.status(200).send({user:userStored});
                        }
                    }
                })
            })
    }
    else{
        res.status(403).send({message:"introduce los datos correctamente"});
    }

    
}

module.exports = {
    pruebas,
    saveUser
}