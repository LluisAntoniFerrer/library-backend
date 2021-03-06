"use-strict"
var express = require("express");

var UserController = require("../controllers/user");
var api = express.Router();
var md_auth = require("../middlewares/authenticated");
//Libreria para manejo de archivos multimedia
var multipart = require("connect-multiparty");
const user = require("../models/user");
var md_upload = multipart({uploadDir:"./uploads/users"});
//Aplicando el middleware al endpoint
api.get("/pruebas", md_auth.ensureAuth, UserController.pruebas);
api.post("/register", UserController.saveUser)
api.post("/login", UserController.login)
api.put("/update-user/:id",md_auth.ensureAuth, UserController.updateUser)
api.post("/upload-image-user/:id",[md_auth.ensureAuth, md_upload], UserController.uploadImage)
api.get("/get-image-file/:imageFile", UserController.getImageFile);
api.get("/authors",UserController.getAuthors);
module.exports = api;