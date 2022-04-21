const { Router } = require('express');
const { check } = require('express-validator');

const { addActivity, updateActivity, deleteActivity, getActivities, getActivity } = require('../controllers/activity');
const { validarCampos } = require('../middlewares/validar-campos');
const { isLabelCorrect } = require('../helpers/isLabelCorrect');
const { jwtValidator } = require('../middlewares/jwt-validator');

const router = Router();

router.use( jwtValidator );

router.get('/', getActivities);

router.get('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    validarCampos
], getActivity);

router.post('/', [
    check('title', 'El titulo es obligatorio').notEmpty(),
    check('title', 'El titulo debe ser una frase').isString(),
    check('labels', 'La información debe ser un objeto').isObject(),
    check('labels', 'Las etiquetas son obligatorias').notEmpty(),
    check('labels', 'Solo debe haber 3 etiquetas en el objeto: min, ok, ideal').custom( isLabelCorrect ),
    check('description', 'La descripción debe ser válida').isString(),
    check('description', 'La descripción debe ser válida').isLength({ min: 10 }),
    validarCampos,
], addActivity);

router.post('/update/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('title', 'El titulo es obligatorio').notEmpty(),
    check('title', 'El titulo debe ser una frase').isString(),
    check('labels', 'La información debe ser un objeto').isObject(),
    check('labels', 'Las etiquetas son obligatorias').notEmpty(),
    check('labels', 'Solo debe haber 3 etiquetas en el objeto: min, ok, ideal').custom( isLabelCorrect ),
    check('description', 'La descripción es obligatoria'),
    validarCampos,
], updateActivity);

router.delete('/delete/:id', [
    check('id', 'El id no es válido').isMongoId(),
    validarCampos
], deleteActivity);

module.exports = router;
