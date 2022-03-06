const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { Usuario } = require('../models/index');
const { createJWT } = require('../helpers/create-jwt');


const createUser = async( req = request, res = response ) => {

    const { name, email, password } = req.body;

    try {

        // Verificar existencia del user en la DB
        const usuarioExist = await Usuario.findOne({ email });
        if ( usuarioExist ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado'
            });
        }

        // Crear usuario y alamcenar en la DB
        const usuario = new Usuario({ name, email, password });

        // Encriptar password
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt );

        await usuario.save();

        // Generar JWT del user
        const token = await createJWT( usuario._id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }

}

const login = async( req = request, res = response ) => {

    const { email, password } = req.body;

    try {

        // Verificar la existencia del correo
        const usuario = await Usuario.findOne({ email });
        if ( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario / contraseña no son correctos'
            });
        }

        // Verificar si está activo en la DB
        if ( !usuario.status ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario / contraseña no son correctos'
            });
        }

        // Verificar password contra la DB
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario / contraseña no son correctos'
            });
        }

        // Generar JWT
        const token = await createJWT( usuario._id, usuario.name );
        
        res.status(200).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }
    
}

const renewToken = async( req = request, res = response ) => {

    const user = req.usuario; // Se extrae el usuario del token

    try {

        // Generar JWT nuevamente
        const token = await createJWT( user._id, user.name );
        
        res.status(201).json({
            ok: true,
            token,
            uid: user._id,
            name: user.name
        });

    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }

}

module.exports = {
    createUser,
    login,
    renewToken
}
