"use-strict"
//modulos
var bcrypt = require("bcrypt-nodejs")
//modelos
var User = require("../models/user")
//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: "probando el controllador de usuarios y la accion pruebas"
    });
}

function saveUser(req, res) {
    //Crear objeto del modelo Usuario
    var user = new User()

    //Recoger parametros de la petición, el body
    var params = req.body

    if (params.password && params.name && params.surname && params.email) {
        //Assignar valores al objeto Usuario
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = "ROLE_USER";
        User.findOne({
            email: user.email.toLowerCase()
        }, (err, issetUser) => {
            if (err) {
                res.status(500).send({
                    message: "Error al comprobar el usuario"
                });
            } else {
                if (!issetUser) {
                    //Cifrar el password
                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        user.password = hash;
                        //Guardar user en BBDD
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({
                                    message: "Error al guardar el usuario"
                                });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({
                                        message: "No se registró el usuario"
                                    });
                                } else {
                                    res.status(200).send({
                                        user: userStored
                                    });
                                }
                            }
                        })
                    })
                } else {
                    res.status(403).send({
                        message: "EL usuario ya existe"
                    });
                }
            }
        })

    } else {
        res.status(403).send({
            message: "introduce los datos correctamente"
        });
    }


}

function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password
    User.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: "Error al comprobar el usuario"
            });
        } else {
            if (user) {
                bcrypt.compare(password,user.password,(err,check)=>{
                    if(check){
                        res.status(200).send({user});
                    }
                    else{
                        res.status(404).send({
                            message: "El mail o la contraseña son incorrectos"
                        });
                    }
                })
               
            } else {
                res.status(404).send({
                    message: "El mail o la contraseña son incorrectos"
                });
            }
        }
    });
  
}

module.exports = {
    pruebas,
    saveUser,
    login
}