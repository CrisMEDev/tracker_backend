const { response, request } = require('express');

const { Activity } = require('../models/index');

const addActivity = async( req = request, res = response ) => {
    const { title, labels } = req.body;
    const usuario = req.usuario;

    try {

        const activity = Activity();
        activity.user = usuario._id;
        activity.title = title;
        activity.labels = labels;

        const activitySave = await activity.save();
        
        res.status(201).json({
            ok: true,
            usuario,
            activity: activitySave
        });

    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }
}

const updateActivity = async( req = request, res = response ) =>{
    const { title, labels } = req.body;
    const usuario = req.usuario;
    const activityId = req.params.id;

    try {

        // Verificar si existe la actividad en DB
        const activity = await Activity.findById( activityId );
        if ( !activity ){
            return res.status(404).json({
                ok: false,
                msg: 'La actividad no existe'
            });
        }

        // Verificar el estado de la actividad
        if ( !activity.status ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el registro en la base de datos'
            });
        }

        // Verificar que la actividad pertenece al usuario en cuestion
        if ( activity.user.toString() !== usuario._id.toString() ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para editar esta actividad'
            });
        }

        // Actualizar data
        const newActivity = {
            title,
            labels,
            user: usuario._id,
            creationDate: activity.creationDate
        }

        const updatedActivity = await Activity.findByIdAndUpdate( activityId, newActivity, { new: true } )

        res.status(200).json({
            usuario,
            activity: updatedActivity
        });
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }
}

const deleteActivity = async( req = request, res = response ) => {

    const activityId = req.params.id;
    const usuario = req.usuario;

    try {
        
        // Verificar si existe la actividad en DB
        const activity = await Activity.findById( activityId );
        if ( !activity ){
            return res.status(404).json({
                ok: false,
                msg: 'La actividad no existe'
            });
        }

        // Verificar el estado de la actividad
        if ( !activity.status ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el registro en la base de datos'
            });
        }

        // Verificar que la actividad pertenece al usuario en cuestion
        if ( activity.user.toString() !== usuario._id.toString() ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para eliminar esta actividad'
            });
        }

        // Borrar activity
        const activityDeleted = await Activity.findByIdAndUpdate( activityId, { status: false }, { new: true } );

        res.status(200).json({
            ok: true,
            usuario,
            activity: activityDeleted
        });
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }

}

const getActivities = async( req = request, res = response ) => {

    const usuario = req.usuario;

    try {

        const activities = await Activity.find({ status: true, user: usuario })
                                         .populate('user', ['name', 'email']);

        res.status(200).json({
            ok: true,
            activities
        });
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }

}

const getActivity = async( req = request, res = response ) => {

    const activityId = req.params.id;
    const usuario = req.usuario;

    try {
        
        // Verificar si existe la actividad en DB
        const activity = await Activity.findById( activityId );
        if ( !activity ){
            return res.status(404).json({
                ok: false,
                msg: 'La actividad no existe'
            });
        }

        // Verificar el estado de la actividad
        if ( !activity.status ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el registro en la base de datos'
            });
        }

        // Verificar que la actividad pertenece al usuario en cuestion
        if ( activity.user.toString() !== usuario._id.toString() ){
            return res.status(401).json({
                ok: false,
                msg: 'La actividad no existe'
            });
        }

        res.status(200).json({
            ok: true,
            activity
        });
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }

}

module.exports = {
    addActivity,
    updateActivity,
    deleteActivity,
    getActivities,
    getActivity
}