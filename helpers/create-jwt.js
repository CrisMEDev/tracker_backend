const jwt = require('jsonwebtoken');

const createJWT = ( uid, name ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { uid, name };

        jwt.sign( payload, process.env.SECRET_OR_PRIVATE_KEY, { // La firma del token para saber si es de mi backend
            expiresIn: '4h',    // el token durará 4 horas
        }, ( error, token ) => {
            if ( error ){
                // console.log( error );
                reject('No se pudo generar el JWT');
            } else{
                resolve( token );
            }
        });

    });

}

module.exports = {
    createJWT
}
