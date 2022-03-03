const express = require('express');
const cors = require('cors');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:           '/trackerapi/auth',
        }

        // Inicia los middlewares
        this.middlewares();

        // Rutas de la aplicación (endpoints)
        this.routes();
    }
    
    middlewares(){
    
        // Configuración básica CORS habilitada
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio público
        this.app.use( express.static('public') );

    }

    routes(){

        this.app.use( this.paths.auth,          require('../routes/auth') );
        
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto: ', this.port);
        });
    }

}

module.exports = Server;
