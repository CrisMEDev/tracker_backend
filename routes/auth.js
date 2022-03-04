const { Router } = require('express');
const { check } = require('express-validator');

const { createUser, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Se pasa la referencia del controller correspondiente en cada petición, en este caso crearUsuario
router.post('/', [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe ser de al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], createUser );

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login );

router.get( '/renew', renewToken);

module.exports = router;