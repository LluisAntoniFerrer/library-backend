'use-strict'
//modulos
var fs = require("fs")
var path = require("path")
//modelos
var User = require("../models/user")
var Book = require("../models/book")

//servicio jwt 
var jwt = require("../services/jwt")
const book = require("../models/book")
//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: "probando el controllador de usuarios y la accion pruebas",
        user: req.user
    });
}

function saveBook(req, res) {
    var book = new Book();
    var params = req.body;

    if (params.title) {
        book.title = params.title;
        book.description = params.description;
        book.year = params.year;
        book.image = null;
        book.reference = params.reference;
        book.user_author = req.user.sub;

        book.save((err, bookStored) => {
            if (err) {
                res.status(500).send({
                    message: "Error en el servidor"
                });
            } else {
                if (!bookStored) {
                    res.status(404).send({
                        message: "No se ha guardado correctamente el libro"
                    });
                } else {
                    res.status(200).send({
                        book: bookStored
                    });
                }
            }
        })
    } else {
        res.status(200).send({
            message: "El titulo del libro es obligatorio"
        });
    }
}

function getBooks(req, res) {
    Book.find({}).populate({ path: 'user_author' }).exec((err, books) => {
        if (err) {
            res.status(500).send({
                message: "Error en la petición"
            });
        } else {
            if (!books) {
                res.status(404).send({
                    message: "No hay libros"
                });
            } else {
                res.status(200).send({
                    books
                });
            }
        }
    })
}

function getBookById(req,res) {
    var bookId =req.params.id;

    Book.findById(bookId).populate({ path: 'user_author' }).exec((err, book) => {
        if (err) {
            res.status(500).send({
                message: "Error en la petición"
            });
        } else {
            if (!book) {
                res.status(404).send({
                    message: "No existe el libro"
                });
            } else {
                res.status(200).send({
                    book
                });
            }
        }
    })
}

function updateBook(req,res) {
    var bookId = req.params.id;
    var update = req.body;

    Book.findByIdAndUpdate(bookId, update, {new:true}, (err, bookUpdated) => {
        if (err) {
            res.status(500).send({
                message: "Error en la petición"
            });
        } else {
            if (!bookUpdated) {
                res.status(404).send({
                    message: "No se ha actualizado el libro"
                });
            } else {
                res.status(200).send({
                    book: bookUpdated
                });
            }
        }
    })
}

function uploadImage(req, res) {
    var bookId = req.params.id;
    var file_name = "no subido...";
    if (Object.keys(req.files).length!==0) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("/");
        var file_name = file_split[2];
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        if (file_ext == "png" || file_ext == "jpg" || file_ext == "jpeg" || file_ext == "gif") {

            //{new:true} es unaopcion de mongoose para establecer que devuelva la ultima actualización del objeto
            Book.findByIdAndUpdate(bookId, {image:file_name}, {
                new: true
            }, (err, bookUpdated) => {
                if (err) { 
                    res.status(500).send({
                        message: "Error al actualizar el libro"
                    })
                } else {
                    if (!bookUpdated) {
                        return res.status(404).send({
                            message: "No se ha podido actualizar el libro"
                        });
                    } else {
                        return res.status(200).send({
                            book: bookUpdated,
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
    var path_file = './uploads/books/'+imageFile;
    
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

function deleteBook(req,res) {
    var bookId = req.params.id;

    Book.findByIdAndRemove(bookId, (err, bookRemoved) => {
        if (err) { 
            res.status(500).send({
                message: "Error en la petición"
            })
        } else {
            if (!bookRemoved) {
                return res.status(404).send({
                    message: "No se ha podido borrar el libro"
                });
            } else {
                return res.status(200).send({
                    book: bookRemoved
                    
                });
            }
        }
    })
}

module.exports = {
    pruebas,
    saveBook,
    getBooks,
    getBookById,
    updateBook,
    uploadImage,
    getImageFile,
    deleteBook

}