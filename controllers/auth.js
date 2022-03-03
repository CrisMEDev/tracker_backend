const { response, request } = require('express');


const login = ( req = request, res = response ) => {

    const { name, email, password } = req.body;

    try {

        res.json({
            name,
            email,
            password
        });
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }

}

module.exports = {
    login,
}
