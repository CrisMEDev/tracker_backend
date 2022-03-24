const { Schema, model } = require('mongoose');

const ActivitySchema = Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio']
    },

    labels: {
        min: {
            type: String
        },

        ok: {
            type: String
        },

        ideal: {
            type: String
        }
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

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',      // Referencia al schema usuario
        required: true
    }
});

ActivitySchema.methods.toJSON = function(){

    const { __v, _id, ...activiy } = this.toObject();

    activiy.activity_id = _id;
    
    return activiy;
    
}

module.exports = model( 'Activity', ActivitySchema );


