const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const { Usuario } = require('../models/index');

const jwtValidator = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No se ha detectado un token en la petición'
        });
    }

    try {

        // Verifica si es un JWT válido y si es así se extrae el uid del user que hizo la petición
        const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY );
        
        // Leer el usuario del modelo
        const usuario = await Usuario.findById( uid );

        if ( !usuario ){
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido - usuario no existe en BD'
            });
        }

        // Verificar si el uid tiene estado true
        if ( !usuario.status ){
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido - usuario no encontrado'
            });
        }

        // Se coloca el usuario en la request, como pasa por referencia ahora los otros
        // validators, middlewares o controladores tendran acceso
        req.usuario = usuario;
        
        next();
    } catch (error) {
        // console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }


}

module.exports = {
    jwtValidator
}