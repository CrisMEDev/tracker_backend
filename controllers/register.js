const { response, request } = require('express');

const { Activity, ActivityRegister } = require('../models/index');

const { daysInMonth } = require('../helpers/days-number');
const { modifyLabels } = require('../helpers/modify-labels');
const { arrayOfDays } = require('../helpers/fill-month-array');


const getRegisterByDate = async( req = request, res = response ) => {

    const usuario = req.usuario;
    const activityId = req.params.id;
    const { month, year } = req.params;

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

        // Verificar si ya existe un registro en la DB para la actividad con el año y mes dados
        const register = await ActivityRegister.findOne({ activity: activityId, year, month, status: true });
        if ( !register ){
            return res.status(400).json({
                ok: false,
                msg: 'No existe un registro en la fecha actual'
            });
        }

        res.status(200).json({
            ok: true,
            register
        });
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }
    
}

const createRegister = async( req = request, res = response ) => {

    const usuario = req.usuario;
    const activityId = req.params.id;
    const { month, year } = req.body;
    
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

        // Verificar si ya existe un registro en la DB para la actividad con el año y mes dados
        const register = await ActivityRegister.findOne({ activity: activityId, year, month });
        if ( register ){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un registro en la fecha actual'
            });
        }

        // Crear registro en la DB
        const days = arrayOfDays( daysInMonth( year, month ) ); // TODO: Esto es mejor hacerlo desde el frontend
        
        const activityRegister = ActivityRegister();
        activityRegister.user = usuario._id;
        activityRegister.activity = activityId;
        activityRegister.month = month;
        activityRegister.year = year;
        activityRegister.daysLabel = days;

        const registerSave = await activityRegister.save();

        res.status(201).json({
            ok: true,
            register: registerSave
        });
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }
    
}

const updateRegister = async( req = request, res = response ) => {

    const usuario = req.usuario;
    const activityId = req.params.id;
    const year = req.params.year;
    const month = req.params.month;
    const { days, values } = req.body
    
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

        // Verificar si ya existe un registro en la DB para la actividad con el año y mes dados
        const register = await ActivityRegister.findOne({ activity: activityId, year, month, status: true });
        if ( !register ){
            return res.status(400).json({
                ok: false,
                msg: 'No existe un registro en la fecha actual'
            });
        }

        // Actualizar valor de etiquetas del registro
        const newValuesLabels = modifyLabels( [...register.daysLabel], days, values );

        const newRegister = {
            month,
            year,
            daysLabel: newValuesLabels,
            creationDate: register.creationDate,
            activity: activityId,
            user: usuario._id
        }

        const updatedRegister = await ActivityRegister.findOneAndUpdate({
                                                       activity: activityId, month, year },
                                                       newRegister,
                                                       { new: true });

        res.status(200).json({
            ok: true,
            register: updatedRegister
        });
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }
    
}

const deleteRegister = async( req = request, res = response ) => {

    const activityId = req.params.id;
    const year = req.params.year;
    const month = req.params.month;
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
                msg: 'No tiene permisos para editar esta actividad'
            });
        }

        // Verificar si ya existe un registro en la DB para la actividad con el año y mes dados
        const register = await ActivityRegister.findOne({ activity: activityId, year, month, status: true });
        if ( !register ){
            return res.status(400).json({
                ok: false,
                msg: 'No existe un registro en la fecha actual'
            });
        }

        // Actualizar valor de etiquetas del registro
        const { year: y, month: m, daysLabel, creationDate, lastUpdate } = register;

        // Registro nuevo para actualizar el estado a false
        const newRegister = {
            year: y,
            month: m,
            daysLabel,
            creationDate,
            lastUpdate,
            status: false,
            activity: activityId,
            user: usuario._id
        }

        const deletedRegister = await ActivityRegister.findOneAndUpdate({
                                                       activity: activityId, month, year },
                                                       newRegister,
                                                       { new: true });
        
        res.status(200).json({
            ok: true,
            register: deletedRegister
        });

    } catch (error) {
        console.log( error );
        return res.status(500).json({
            msg: 'Algo salió mal, contacte a su administrador'
        });
    }
    
}

module.exports = {
    getRegisterByDate,
    createRegister,
    updateRegister,
    deleteRegister
}

