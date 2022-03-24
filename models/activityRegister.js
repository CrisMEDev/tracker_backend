const { Schema, model } = require('mongoose');

const ActivityRegisterSchema = Schema({
    month: {
        type: Number,
        required: [true, 'El numero de mes es obligatorio (1-12)']
    },

    year: {
        type: Number,
        required: [true, 'El año es obligatorio']
    },

    daysLabel: {
        values: [Number],
    },

    creationDate: {
        type: Date,
        default: Date.now
    },

    lastUpdate: {
        type: Date,
        default: Date.now
    },

    status: {
        type: Boolean,
        default: true
    },

    activiy: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',      // Referencia al schema usuario
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',      // Referencia al schema usuario
        required: true
    }
});

ActivityRegister.methods.toJSON = function(){

    const { __v, _id, ...register } = this.toObject();

    register.register_id = _id;
    
    return register;
    
}

module.exports = model( 'ActivityRegister', ActivityRegisterSchema );


