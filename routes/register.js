const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { jwtValidator } = require('../middlewares/jwt-validator');
const { createRegister, updateRegister, deleteRegister } = require('../controllers/register');

const router = Router();

router.use( jwtValidator );

router.post('/:id', [
    check('id', 'El id no es válido').isMongoId(),
    check('month', 'El número de mes es incorrecto: 1-12').isInt({ min: 1, max: 12 }),
    check('year', 'El número de año es incorrecto').isInt({ min: 2020, max: 2050 }),
    validarCampos
], createRegister);

router.post('/update/:id/:year/:month', [
    check('id', 'El id no es válido').isMongoId(),
    check('month', 'El número de mes es incorrecto: 1-12').isInt({ min: 1, max: 12 }),
    check('year', 'El número de año es incorrecto').isInt({ min: 2020, max: 2050 }),
    check('days', 'El día no es correcto').isInt({ min: 1, max: 31 }),
    check('values', 'El valor de la etiqueta no es correcto: 0-3').isInt({ min: 0, max: 3 }),
    validarCampos
], updateRegister);

router.delete('/delete/:id/:year/:month', [
    check('id', 'El id no es válido').isMongoId(),
    check('month', 'El número de mes es incorrecto: 1-12').isInt({ min: 1, max: 12 }),
    check('year', 'El número de año es incorrecto').isInt({ min: 2020, max: 2050 }),
    validarCampos
], deleteRegister);

module.exports = router;

