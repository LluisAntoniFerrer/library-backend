"use-strict"
//modulos
var bcrypt = require("bcrypt-nodejs")
var fs = require("fs")
var path = require("path")
//modelos
var User = require("../models/user")
//servicio jwt 
var jwt = require("../services/jwt")
//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: "probando el controllador de usuarios y la accion pruebas",
        user: req.user
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
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        //Comprobar y generar el token
                        if (params.getToken) {
                            //devolver el token
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }
                        res.status(200).send({
                            user
                        });
                    } else {
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

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body
    if (userId != req.user.sub) {
        return res.status(500).send({
            message: "No tienes permisos para actualizar el usuario"
        });
    }
    //{new:true} es unaopcion de mongoose para establecer que devuelva la ultima actualización del objeto
    User.findByIdAndUpdate(userId, update, {
        new: true
    }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: "Error al actualizar el usuario"
            })
        } else {
            if (!userUpdated) {
                return res.status(404).send({
                    message: "No se ha podido actualizar el usuario"
                });
            } else {
                return res.status(200).send({
                    user: userUpdated
                });
            }
        }
    });

}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "no subido...";
    if (Object.keys(req.files).length!==0) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("/");
        var file_name = file_split[2];
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        if (file_ext == "png" || file_ext == "jpg" || file_ext == "jpeg" || file_ext == "gif") {
            if (userId != req.user.sub) {
                return res.status(500).send({
                    message: "No tienes permisos para actualizar el usuario"
                });
            }
            //{new:true} es unaopcion de mongoose para establecer que devuelva la ultima actualización del objeto
            User.findByIdAndUpdate(userId, {image:file_name}, {
                new: true
            }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: "Error al actualizar el usuario"
                    })
                } else {
                    if (!userUpdated) {
                        return res.status(404).send({
                            message: "No se ha podido actualizar el usuario"
                        });
                    } else {
                        return res.status(200).send({
                            user: userUpdated,
                            image:file_name
                        });
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err)=>{
                if(err){
                    return res.status(200).send({
                        message: "Extension no valida y fichero  no borrado"
                    });
                }
                else {
                    return res.status(200).send({
                        message: "Extension no valida"
                    });
                }
            })
            
        }
    } else {
        return res.status(200).send({
            message: "No se ha subido el archivo"
        });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;
    
    fs.exists(path_file, function(exists) {
        if(exists){
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({
                message: "La imagen no existe"
            });
        }
    });
}

function getAuthors(req, res) {
    User.find({
        role:'ROLE_AUTHOR'
    }).exec((err, users) => {
        if(err) {
            res.status(500).send({
                message: "Error en la petición"
            });
        } else {
            if(!users) {
                res.status(404).send({
                    message: "No hay autores"
                });
            }else {
                res.status(200).send({
                    users
                });
            }
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getAuthors
}