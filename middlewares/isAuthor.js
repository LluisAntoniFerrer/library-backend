'use strict'

exports.isAuthor = function(req,res, next) {
if(req.user.role != 'ROLE_AUTHOR') {
    return res.status(200).send({
        message: "No tienes acceso de ADMIN, no eres un autor"
    })
}
next();
}