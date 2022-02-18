import { Router } from "express";
import { body, param } from "express-validator";
import { newUser, getUsers, userLogin, deleteUser, updateBasicInfo, updatePassword, updateRole, getSingleUser, addOrRemoveFollower, validateUserToken } from "../controllers/user.mjs";
import { validateEmailAndPassword, findUsedEmail, findExistingUser, hasRole, findExistingRole } from "../middlewares/db-validators.mjs";
import { validateFields } from "../middlewares/validate-fields.mjs";
import { validateToken } from "../middlewares/validate-token.mjs";
import verifyToken from "../middlewares/verify-token.mjs";

const router = Router();

/**
 * Petición para crear un usuario
*/
router.post('/', [
    body('name.first','Los nombres son obligatorios.').notEmpty(),
    body('name.last','Los apellidos son obligatorios.').notEmpty(),
    body('email','El correo electrónico es obligatorio.').isEmail().custom(findUsedEmail),
    body('password','La contraseña es obligatoria, el mínimo de caracteres es 6.').isLength(6),
    body('repeat_password','Repetir contraseña debe ser igual a contraseña.').exists().custom((repeat_password, { req }) => repeat_password === req.body.password),
    validateFields
], newUser);


/*Middleware para obtener un usuario en específico*/
router.get('/:value',[
    param('value','El identificador del usuario a obtener es obligatorio, puede ser por nombre, correo o identificador.').notEmpty(),
    validateFields
], getSingleUser);

/**
 * Petición para obtener la lista de usuarios
*/
router.get('/', getUsers)

/**
 * Petición para iniciar sesión
*/
router.post('/login', [ 
    body('email','El correo electrónico es obligatorio.').isEmail(),
    body('password','La contraseña es obligatoria, mínimo de caracteres es 6').isLength(6),
    validateFields,
    validateEmailAndPassword
] , userLogin);

//Actualizar información básica del usuario
router.patch('/:id', [
    verifyToken,
    hasRole('ADMIN','USER'),
    param('id','El id del usuario a editar es obligatorio y debe ser un id de mongo.').isMongoId().custom(findExistingUser),
    body('name.first','Los nombres son obligatorios.').notEmpty(),
    body('name.last','Los apellidos son obligatorios.').notEmpty(),
    validateFields
], updateBasicInfo);

//Actualizar correo
router.patch('/:id/emails', [
    verifyToken,
    hasRole('ADMIN','USER'),
    param('id','El id del usuario a editar es obligatorio y debe ser un id de mongo.').isMongoId().custom(findExistingUser),
    body('email','El correo electrònico es obligatorio.').isEmail().custom(findUsedEmail),
    body('password','La contraseña es obligatoria, el mìnimo de caracteres es 6.').isLength(6),
    validateFields
], updateBasicInfo);

// Cambiar contraseña
router.patch('/:id/passwords',[ 
    verifyToken,
    hasRole('ADMIN','USER'),
    body('password','Por favor, escribe tu contraseña actual.').isLength(6),
    body('new_password','Por favor, escribe la nueva contraseña, mínimo de caracteres es 6.').isLength(6),
    validateFields
], updatePassword);

//Actualizar rol (debe ser admin para cambiarlo)
router.patch('/:id/roles',[ 
    verifyToken,
    hasRole('ADMIN'),
    body('role','Por favor, envía el nuevo rol, debe estar en mayúscula.').notEmpty().custom(findExistingRole),
    validateFields
], updateRole);

//Borrar usuario (poner estado inactivo)
router.delete('/:id', [
    verifyToken,
    hasRole('ADMIN','USER'),
    param('id','El id del usuario a borrar es obligatorio y debe ser un id de mongo.').isMongoId().custom(findExistingUser),
    validateFields
], deleteUser);


//Petición para añadir seguir o dejar de seguir a una persona
router.patch('/followers/:id',[
    verifyToken,
    param('id').isMongoId().custom(findExistingUser),
    validateFields
], addOrRemoveFollower);

// Petición para validar el token
router.post('/tokens', validateToken, validateUserToken);


export default router;