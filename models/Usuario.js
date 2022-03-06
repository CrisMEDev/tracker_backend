const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']    // El segundo es el mensaje de error que será mostrado en caso falte el nombre
    },
    
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },   // Se guarda encriptado

    status: {
        type: Boolean,
        default: true
    },  // Eliminado para los usuarios pero no de la base de datos

});

UsuarioSchema.methods.toJSON = function(){

    // Genera una instancia de mi Schema con sus valores respectivos
    const { __v, password, status, _id, ...user } = this.toObject(); // Saca la version y el password de mi objeto Schema y el resto lo deja en user

    user.uid = _id; // Renombra la propiedad _id a uid

    return user;
}

module.exports = model( 'Usuario', UsuarioSchema );
