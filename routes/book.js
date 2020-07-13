"use-strict"
var express = require("express");

var BookController = require("../controllers/book");
var api = express.Router();
var md_auth = require("../middlewares/authenticated");
//Middleware seguridad que requiere Rol de Author
var md_author_admin = require("../middlewares/isAuthor");

//Libreria para manejo de archivos multimedia
var multipart = require("connect-multiparty");
var md_upload = multipart({uploadDir:"./uploads/books"});

//Aplicando el middleware al endpoint
api.get("/pruebas-books", md_auth.ensureAuth, BookController.pruebas);
api.post("/book", [ md_auth.ensureAuth, md_author_admin.isAuthor], BookController.saveBook)
api.get("/books", BookController.getBooks);
api.get("/books/:id", BookController.getBookById);
api.put("/books/:id", [ md_auth.ensureAuth, md_author_admin.isAuthor], BookController.updateBook);
api.post("/upload-image-book/:id",[ md_auth.ensureAuth, md_author_admin.isAuthor, md_upload], BookController.uploadImage)
api.get("/get-image-book/:imageFile", BookController.getImageFile);
api.delete("/books/:id", [ md_auth.ensureAuth, md_author_admin.isAuthor], BookController.deleteBook);


module.exports = api;