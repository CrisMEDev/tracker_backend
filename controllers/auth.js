const { response, request } = require('express');


const createUser = ( req = request, res = response ) => {

    const { name, email, password } = req.body;

    try {

        res.status(201).json({
            name,
            email,
            password
        });
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }

}

const login = ( req = request, res = response ) => {

    const { email, password } = req.body;

    try {
        
        res.status(200).json({
            email,
            password
        });

    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }
    
}

const renewToken = ( req = request, res = response ) => {

    try {
        
        res.status(201).json({
            ok: true
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
